// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // your Mongoose model

// Google login sync
router.post("/google", async (req, res) => {
  try {
    const { googleId, name, email, photo } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        photo,
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
