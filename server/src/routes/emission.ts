import express from "express";
import { submitEmission, getUserEmissions } from "../controllers/emissionsController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();


router.post("/submit", authenticateJWT, submitEmission);  // POST /api/emissions/submit


router.get("/my", authenticateJWT, getUserEmissions);  // GET /api/emissions/my

export default router;

