"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/models/Token.ts
const mongoose_1 = __importDefault(require("mongoose"));
const TokenSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    amount: Number,
    transactionType: { type: String, enum: ["mint", "burn", "transfer"], required: true },
    timestamp: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Token", TokenSchema);
