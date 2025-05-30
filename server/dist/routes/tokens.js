"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenController_1 = require("../controllers/tokenController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/my", auth_1.authenticateJWT, tokenController_1.getUserTokens); // GET /api/tokens/my
exports.default = router;
