// server/routes/tokens.ts
import express from "express";
import { getUserTokens } from "../controllers/tokenController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// @route GET /api/tokens/my
// @desc  Get current user's token history
// @access Protected
router.get("/my", authenticateJWT, getUserTokens);

export default router;
