//routes/admin.ts
import express from "express";
import { authenticateJWT } from "../middleware/auth";
import User from "../models/User";
import Emission from "../models/Emission";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ error: "Access denied. Admins only." });
};

// GET /api/admin/users
router.get("/users", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
    console.log("✅ Reached GET /api/admin/users");
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/admin/emissions
router.get("/emissions", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const emissions = await Emission.find().populate("userId", "email");
    res.json(emissions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch emissions" });
  }
});

export default router;
