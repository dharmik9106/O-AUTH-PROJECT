import express from "express";
import passport from "passport";
import HttpError from "../mideleware/HttpError.js";

const router = express.Router();

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Google Login
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google Callback
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(new HttpError("Logout failed", 500));
    }

    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

export default router;