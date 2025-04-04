import express from "express";

import {
  getProfile,
  getFavourites,
  getMyRecipes,
  favourite,
  getAddRecipePage,
  postAddRecipe,
  searchRecipe,
  getRecipeDetailPage,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", getProfile);

userRouter.get("/favourites", getFavourites);

userRouter.get("/my-recipes", getMyRecipes);

userRouter.post("/update-favorites", favourite);

userRouter.get("/recipes/create", getAddRecipePage);

userRouter.post("/recipes/add", postAddRecipe);

userRouter.get("/search-recipes", searchRecipe);

userRouter.get("/recipes/:recipeId", getRecipeDetailPage);

export default userRouter;
