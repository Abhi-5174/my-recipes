import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    req.user = null; // No user found
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    req.user = user; // Attach user details
  } catch (error) {
    req.user = null; // Invalid token
  }

  next();
};

export default isLoggedIn;
