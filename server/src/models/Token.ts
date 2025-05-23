import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: Number,
  transactionType: { type: String, enum: ["mint", "burn", "transfer"], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Token", TokenSchema);