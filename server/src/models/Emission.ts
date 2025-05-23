import mongoose from "mongoose";

const EmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fuel: Number,
  electricity: Number,
  waste: Number,
  totalCO2e: Number,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Emission", EmissionSchema);