"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emissionsController_1 = require("../controllers/emissionsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/submit", auth_1.authenticateJWT, emissionsController_1.submitEmission); // POST /api/emissions/submit
router.get("/my", auth_1.authenticateJWT, emissionsController_1.getUserEmissions); // GET /api/emissions/my
exports.default = router;
