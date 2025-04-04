import "dotenv/config";

import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import router from "./routes/index.js";
import handleUnknownRoute from "./middlewares/undefinedRoutesHandler.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", router);

app.use(handleUnknownRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
