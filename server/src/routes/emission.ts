// server/routes/emissions.ts
import express from "express";
import { submitEmission, getUserEmissions } from "../controllers/emissionsController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// @route POST /api/emissions/submit
// @desc  Submit a new emission record
// @access Protected
router.post("/submit", authenticateJWT, submitEmission);

// @route GET /api/emissions/my
// @desc  Get logged-in user's emission records
// @access Protected
router.get("/my", authenticateJWT, getUserEmissions);

export default router;

