import express from "express";

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

export default otherRouter;
