"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["credit-holder", "validator", "buyer", "issuer", "admin"], default: "credit-holder" },
    walletAddress: { type: String, default: "" }
});
exports.default = mongoose_1.default.model("User", UserSchema);
