import mongoose from "mongoose";

import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";

const getProfile = (req, res) => {
  res.render("profile", { user: req.user, path: "/profile" });
};

const getFavourites = async (req, res) => {
  try {
    const response = await fetch(process.env.RECIEPE_API);
    if (!response.ok) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Unable to fetch favourites data!")
      );
    }
    const data = response.json();

    const filtered = data.results.filter((recipe) => {
      if (req.user.favourites.includes(recipe.id)) {
        return recipe;
      }
    });

    async function filterFavourites() {
      for (const e of req.user.favourites) {
        if (mongoose.Types.ObjectId.isValid(e) && !filtered.includes(e)) {
          const recipe = await Recipe.findById(e);
          if (recipe) filtered.push(recipe);
        }
      }
    }
    await filterFavourites();

    return res.render("favourites", {
      user: req.user,
      path: "/favorites",
      favourites: filtered,
    });
  } catch (error) {
    return res.redirect("/?error=" + encodeURIComponent(error));
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id });
    res.render("recipes", {
      user: req.user,
      path: "/my-recipe",
      recipes,
    });
  } catch (error) {
    return res.redirect("/?error=" + encodeURIComponent(error));
  }
};

const favourite = async (req, res) => {
  try {
    const { recipeId, action } = req.body;
    const userId = req.user._id;

    if (!recipeId || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const updateQuery =
      action === "add"
        ? { $addToSet: { favourites: recipeId } }
        : { $pull: { favourites: recipeId } };

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    res.json({ success: true, favourites: updatedUser.favourites });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAddRecipePage = async (req, res) => {
  res.render("create-recipe", {
    user: req.user,
    path: "/recipe/create",
    recipes: null,
  });
};

const postAddRecipe = async (req, res) => {
  const {
    title,
    image,
    servings,
    readyInMinutes,
    cookingMinutes,
    preparationMinutes,
    instructions,
    healthScore,
    spoonacularScore,
    pricePerServing,
    cuisines,
    diets,
    dishTypes,
    extendedIngredients,
  } = req.body;

  try {
    if (
      !title ||
      !image ||
      !servings ||
      !readyInMinutes ||
      !cookingMinutes ||
      !preparationMinutes ||
      !instructions
    ) {
      return res.redirect(
        "/users/recipes/create?error=" +
          encodeURIComponent("All fields are required!")
      );
    }

    // Parse optional fields
    const parsedCuisines = cuisines
      ? cuisines.split(",").map((cuisine) => cuisine.trim())
      : [];
    const parsedDiets = diets
      ? diets.split(",").map((diet) => diet.trim())
      : [];
    const parsedDishTypes = dishTypes
      ? dishTypes.split(",").map((dishType) => dishType.trim())
      : [];
    const parsedIngredients = extendedIngredients
      ? JSON.parse(extendedIngredients)
      : [];

    // Create a new recipe instance
    const newRecipe = new Recipe({
      title,
      image,
      servings,
      readyInMinutes,
      cookingMinutes,
      preparationMinutes,
      instructions,
      healthScore,
      spoonacularScore,
      pricePerServing,
      cuisines: parsedCuisines,
      diets: parsedDiets,
      dishTypes: parsedDishTypes,
      extendedIngredients: parsedIngredients,
      authorId: req.user._id,
    });

    // Save the recipe to the database
    await newRecipe.save();

    // Send a success response
    res.redirect("/users/my-recipes");
  } catch (error) {
    return res.redirect(
      "/users/recipes/create?error=" + encodeURIComponent(error)
    );
  }
};

const getRecipeDetailPage = async (req, res) => {
  const { recipeId } = req.params;
  if (!recipeId) {
    return res.redirect(
      "/?error=" + encodeURIComponent("Recipe ID is required!")
    );
  }
  try {
    if (mongoose.Types.ObjectId.isValid(recipeId)) {
      const recipe = await Recipe.findById(recipeId);
      return res.render("recipeDetail", {
        user: req.user,
        path: "/recipe-detail",
        recipe,
      });
    }
    const url = `https://api.spoonacular.com/recipes/${recipeId.trim()}/information?apiKey=${
      process.env.SPOONACULAR_API_KEY
    }&includeNutrition=false`;
    const response = await fetch(url);
    if (!response.ok)
      return res.redirect(
        "/?error=" + encodeURIComponent("Unable to fetch recipe data.")
      );
    const data = await response.json();

    return res.render("recipeDetail", {
      user: req.user,
      path: "/recipe-detail",
      recipe: data,
    });
  } catch (error) {
    return res.redirect("/?error=" + encodeURIComponent(error));
  }
};

export {
  getProfile,
  getFavourites,
  getMyRecipes,
  favourite,
  getAddRecipePage,
  postAddRecipe,
  getRecipeDetailPage,
};
