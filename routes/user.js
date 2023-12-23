const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controller/users.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;

