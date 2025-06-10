import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Signup Route
router.post("/customer", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ firstName, lastName, email, message });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
