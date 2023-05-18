const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerdUser = await User.register(user, password);
    req.login(registerdUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Welcome to Travel Ara, ${username.toUpperCase()}!!`
      );
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  const { username } = req.body;
  req.flash("success", `Welcome Back, ${username.toUpperCase()}`);
  const url = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(url);
};

module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", "Logged Out!!");
  res.redirect("/campgrounds");
};

module.exports.validatePassword = (req, res) => {
  req.session.hasVerified = true;
  res.redirect("/changepassword");
};
module.exports.forgotPassword = (req, res) => {
  res.render("users/forgotpassword");
};

module.exports.changePasswordRender = (req, res) => {
  res.render("users/changepassword");
};

module.exports.changePassword = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  await user.setPassword(password);
  await user.save();
  req.flash("success", "Successfully changed the password");
  res.redirect("/campgrounds");
};
