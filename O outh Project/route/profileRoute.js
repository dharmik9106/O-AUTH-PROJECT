import express from "express";
import checkAuth from "../mideleware/checkAuth.js";

const router = express.Router();

// Profile Page
router.get("/", checkAuth, (req, res) => {
  try {
    return res.render("profile", {
      user: req.user,
    });
  } catch (error) {
    return res.status(500).render("error", {
      message: "Something went wrong.",
    });
  }
});

export default router;