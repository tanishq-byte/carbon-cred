// server/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import emissionRoutes from "./routes/emission";
import tokenRoutes from "./routes/tokens";
import adminRoutes from "./routes/admin"
import { authenticateJWT } from "./middleware/auth";

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "";

if (!MONGO_URI || !process.env.JWT_SECRET || !PORT) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

// Global middlewares
app.use(cors());
app.use(express.json());

// Optional: Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emissions", authenticateJWT, emissionRoutes);
app.use("/api/tokens", authenticateJWT, tokenRoutes);
app.use("/api/admin", authenticateJWT, adminRoutes);

// debug
console.log("PORT:", PORT);
console.log("MONGO_URI:", MONGO_URI ? "✓" : "❌ MISSING");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓" : "❌ MISSING");

// 👇 ADD THIS 👇
app.get('/', (req, res) => {
  res.send('🚀 Hello from your DATABASE!');
});

// Connect to MongoDB and start server
// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ Connected to MongoDB");
//     app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection failed:", err);
//     process.exit(1);
//   });

async function main(){
  await mongoose.connect(MONGO_URI);
  console.log("Connected to Mongodb");
  app.listen(PORT,()=>{console.log(`🚀 Server running on http://localhost:${PORT}`)})
}
main()