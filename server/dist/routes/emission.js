"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/emissions.ts
const express_1 = __importDefault(require("express"));
const emissionsController_1 = require("../controllers/emissionsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route POST /api/emissions/submit
// @desc  Submit a new emission record
// @access Protected
router.post("/submit", auth_1.authenticateJWT, emissionsController_1.submitEmission);
// @route GET /api/emissions/my
// @desc  Get logged-in user's emission records
// @access Protected
router.get("/my", auth_1.authenticateJWT, emissionsController_1.getUserEmissions);
exports.default = router;
