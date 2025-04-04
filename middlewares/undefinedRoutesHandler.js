export default (req, res) => {
  res.render("pageNotFound", {
    user: req.user,
  });
};
