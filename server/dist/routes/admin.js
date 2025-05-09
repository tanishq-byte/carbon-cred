"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/admin.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Emission_1 = __importDefault(require("../models/Emission"));
const router = express_1.default.Router();
// Middleware to check if user is admin
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin")
        return next();
    return res.status(403).json({ error: "Access denied. Admins only." });
});
// GET /api/admin/users
router.get("/users", auth_1.authenticateJWT, isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select("-password");
        res.json(users);
        console.log("✅ Reached GET /api/admin/users");
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
}));
// GET /api/admin/emissions
router.get("/emissions", auth_1.authenticateJWT, isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emissions = yield Emission_1.default.find().populate("userId", "email");
        res.json(emissions);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch emissions" });
    }
}));
exports.default = router;
