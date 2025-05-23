import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["credit-holder", "validator", "buyer", "issuer", "admin"], default: "credit-holder" },
  walletAddress: { type: String, default: "" }
});

export default mongoose.model("User", UserSchema);