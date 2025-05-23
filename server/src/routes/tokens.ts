import express from "express";
import { getUserTokens } from "../controllers/tokenController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();



router.get("/my", authenticateJWT, getUserTokens);  // GET /api/tokens/my

export default router;
