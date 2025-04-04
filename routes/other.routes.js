import express from "express";

import { searchRecipe } from "../controllers/other.controller.js";

const otherRouter = express.Router();

otherRouter.get("/categories", (req, res) => {
  res.render("categories", {
    user: req.user,
    path: "/categories",
    favourites: [],
  });
});

otherRouter.get("/about", (req, res) => {
  res.render("about", {
    user: req.user,
    path: "/about",
    favourites: [],
  });
});

otherRouter.get("/contact", (req, res) => {
  res.render("contact", {
    user: req.user,
    path: "/contact",
    favourites: [],
  });
});

otherRouter.get("/search-recipes", searchRecipe);

export default otherRouter;
