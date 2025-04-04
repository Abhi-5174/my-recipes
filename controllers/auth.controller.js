import User from "../models/user.model.js";
import {
  generateResetToken,
  verifyResetToken,
  generateToken,
} from "../utils/jwt.js";
import setCookie from "../utils/cookie.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Email and password are required.")
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Invalid email or password.")
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Invalid email or password.")
      );
    }

    const token = await generateToken(user._id);

    setCookie(res, "auth_token", token);

    res.redirect("/");
  } catch (error) {
    res.status(500).redirect("/?error=" + encodeURIComponent(error));
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Passwords do not match")
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Email is already registered.")
      );
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const user = await newUser.save();

    const token = await generateToken(user._id);

    setCookie(res, "auth_token", token);

    res.redirect("/");
  } catch (error) {
    return res.redirect("/?error=" + encodeURIComponent(error.message));
  }
};

const logout = (req, res, next) => {
  res.clearCookie("auth_token");
  res.redirect("/");
};

export { login, signup, logout };
