"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
exports.default = router;
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTRhNzBjZTI4MzYwNjcwZTliMTkiLCJyb2xlIjoiY3JlZGl0LWhvbGRlciIsImlhdCI6MTc0NDc0MTY2M30.n1W6HWEP1iFWROXiqzK2PWpQEWNyJ6T0ZlysA74t1h0",
//     "role": "credit-holder"
// }
