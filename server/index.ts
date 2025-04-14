// server/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import emissionRoutes from "./routes/emission";
import tokenRoutes from "./routes/tokens";

import { authenticateJWT } from "./middleware/auth";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/emissions", authenticateJWT, emissionRoutes);
app.use("/api/tokens", authenticateJWT, tokenRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));