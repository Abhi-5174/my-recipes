import express from "express";

import authRouter from "./auth.routes.js";
import userRouter from "./user.routers.js";
import otherRouter from "./other.routes.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const resp = await fetch(process.env.RECIEPE_API);
    if (!resp.ok) {
      res.redirect(
        "/?error=" + encodeURIComponent(resp.error || "Unable to fetch data!")
      );
    }
    const data = await resp.json();

    return res.render("homepage", {
      user: req.user,
      reciepes: data.results,
      path: "/",
    });
  } catch (error) {
    return res.status(500).redirect("/?error=" + encodeURIComponent(error));
  }
});

router.use("/auth", authRouter);

router.use("/users", isLoggedIn, isAuthenticated, userRouter);

router.use("/others", otherRouter);

export default router;
