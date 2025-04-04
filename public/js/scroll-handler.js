document.addEventListener("DOMContentLoaded", function () {
  const recipesGrid = document.getElementById("recipesGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (!recipesGrid || !loadMoreBtn) return;

  let page = 1;
  let isLoading = false;
  let noMoreRecipes = false;
  let debounceTimer;

  loadMoreBtn.addEventListener("click", function () {
    if (!isLoading && !noMoreRecipes) {
      loadMoreRecipes();
    }
  });

  window.addEventListener("scroll", function () {
    if (isLoading || noMoreRecipes) return;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 500
      ) {
        loadMoreRecipes();
      }
    }, 200); // 200ms debounce
  });

  function loadMoreRecipes() {
    isLoading = true;
    loadMoreBtn.textContent = "Loading...";
    loadMoreBtn.disabled = true;

    fetch(`/api/recipes?page=${page++}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          data.results.forEach((recipe) => {
            if (recipe) {
              addToRecipeGrid(recipe);
            }
          });

          loadMoreBtn.textContent = "Load More";
          loadMoreBtn.disabled = false;
        } else {
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

  function addToRecipeGrid(recipe) {
    document.getElementById("recipesGrid").innerHTML += `
            <div class="recipe-card" data-id="${recipe.id}">
                <div class="recipe-image"
                    style="background-image: url('${
                      recipe.image
                    }'); display: flex; align-items: flex-start; justify-content: flex-end;">
                    
                    ${
                      user
                        ? `<button class="favorite-btn ${
                            user.favourites.includes(recipe.id) ? "active" : ""
                          }"
                                data-recipe-id="${recipe.id}"
                                title="${
                                  user.favourites.includes(recipe.id)
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }"
                                onclick="favourite('${recipe.id}')">
                            <span class="heart-icon" style="filter: drop-shadow(10px 7px 10px black)">♥</span>
                           </button>`
                        : `<button class="favorite-btn"
                                data-recipe-id="${recipe.id}"
                                title="Add to favorites"
                                onclick="window.location.href = '/?error=Please log in to favorite recipes.'">
                            <span class="heart-icon" style="filter: drop-shadow(10px 7px 10px black)">♥</span>
                           </button>`
                    }
                </div>

                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-actions">
                        <a href="${
                          user
                            ? `/recipes/${recipe.id}`
                            : "/?error=Please log in to show details of the recipe."
                        }" 
                            class="view-recipe">View Recipe →</a>

                        ${
                          user && user._id === recipe.authorId
                            ? `<div class="recipe-buttons">
                                <a href="/recipes/edit/${recipe.id}" class="edit-btn">Edit</a>
                                <button class="delete-btn" data-recipe-id="${recipe.id}">Delete</button>
                               </div>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
  }
});
