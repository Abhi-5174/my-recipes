// /public/js/scroll-handler.js
document.addEventListener("DOMContentLoaded", function () {
  const recipesGrid = document.getElementById("recipesGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (!recipesGrid || !loadMoreBtn) return;

  let page = 1;
  let isLoading = false;
  let noMoreRecipes = false;
  let debounceTimer;

  // Load more button click handler
  loadMoreBtn.addEventListener("click", function () {
    if (!isLoading && !noMoreRecipes) {
      loadMoreRecipes();
    }
  });

  // Infinite scrolling with debouncing
  window.addEventListener("scroll", function () {
    if (isLoading || noMoreRecipes) return;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      // Check if we're near the bottom of the page
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 500
      ) {
        loadMoreRecipes();
      }
    }, 200); // 200ms debounce
  });

  // Function to load more recipes
  function loadMoreRecipes() {
    isLoading = true;
    loadMoreBtn.textContent = "Loading...";
    loadMoreBtn.disabled = true;

    // Make AJAX request to load more recipes
    fetch(`/api/recipes?page=${++page}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recipes && data.recipes.length > 0) {
          // Template for recipe cards
          const recipeCards = data.recipes
            .map((recipe) => createRecipeCardHTML(recipe))
            .join("");

          // Append new recipe cards
          const tempContainer = document.createElement("div");
          tempContainer.innerHTML = recipeCards;

          // Initialize favorite buttons on new cards
          const newFavoriteButtons =
            tempContainer.querySelectorAll(".favorite-btn");
          newFavoriteButtons.forEach((button) => {
            button.addEventListener("click", handleFavoriteClick);
          });

          // Append new cards to grid
          while (tempContainer.firstChild) {
            recipesGrid.appendChild(tempContainer.firstChild);
          }

          // Update UI state
          loadMoreBtn.textContent = "Load More";
          loadMoreBtn.disabled = false;
        } else {
          // No more recipes
          noMoreRecipes = true;
          loadMoreBtn.textContent = "No More Recipes";
          loadMoreBtn.disabled = true;
        }
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading more recipes:", error);
        loadMoreBtn.textContent = "Error. Try Again";
        loadMoreBtn.disabled = false;
        isLoading = false;
      });
  }

  // Function to handle favorite button clicks
  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // This should match the logic in favorites.js
    const recipeId = this.dataset.recipeId;
    const isLoggedIn = document.body.dataset.loggedIn === "true";

    if (!isLoggedIn) {
      document.getElementById("loginModal").style.display = "flex";
      document.body.classList.add("modal-open");
      return;
    }

    // Toggle favorite state
    const isFavorite = this.classList.contains("active");
    this.classList.toggle("active");
    this.title = isFavorite ? "Add to favorites" : "Remove from favorites";

    // Send request to server - duplicated from favorites.js for this example
    fetch(`/api/favorites/${recipeId}`, {
      method: isFavorite ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          .content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          this.classList.toggle("active");
          this.title = isFavorite
            ? "Remove from favorites"
            : "Add to favorites";
          showToast("Error updating favorites. Please try again.");
        } else {
          showToast(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.classList.toggle("active");
        this.title = isFavorite ? "Remove from favorites" : "Add to favorites";
        showToast("Error updating favorites. Please try again.");
      });
  }

  // Helper function to create recipe card HTML (simplified version of the EJS template)
  function createRecipeCardHTML(recipe) {
    const isLoggedIn = document.body.dataset.loggedIn === "true";
    const userId = document.body.dataset.userId;

    return `
            <div class="recipe-card" data-id="${recipe.id}">
                <div class="recipe-image" style="background-image: url('${
                  recipe.image
                }')">
                    <button class="favorite-btn ${
                      recipe.isFavorite ? "active" : ""
                    }" 
                            data-recipe-id="${recipe.id}"
                            title="${
                              recipe.isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }">
                        <span class="heart-icon">♥</span>
                    </button>
                </div>
                <div class="recipe-content">
                    <div class="recipe-tags">
                        ${recipe.tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span>⏱️ ${recipe.time}</span>
                        <span>📊 ${recipe.difficulty}</span>
                    </div>
                    <div class="recipe-actions">
                        <a href="/recipes/${
                          recipe.id
                        }" class="view-recipe">View Recipe →</a>
                        ${
                          isLoggedIn && recipe.authorId === userId
                            ? `
                            <div class="recipe-buttons">
                                <a href="/recipes/edit/${recipe.id}" class="edit-btn">Edit</a>
                                <button class="delete-btn" data-recipe-id="${recipe.id}">Delete</button>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
  }

  // Helper function for displaying toast notifications
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
});
