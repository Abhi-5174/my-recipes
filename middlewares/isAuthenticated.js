const isAuthenticated = (req, res, next) => {
  if (!req.user)
    return res.redirect("/?error=" + encodeURIComponent("Please login first!"));

  next();
};

export default isAuthenticated;
