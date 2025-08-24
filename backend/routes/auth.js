import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.json({ message: "Signup successful ✅" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get current user profile
router.get("/me", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
