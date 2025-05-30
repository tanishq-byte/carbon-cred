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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const emission_1 = __importDefault(require("./routes/emission"));
const tokens_1 = __importDefault(require("./routes/tokens"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "";
if (!MONGO_URI || !process.env.JWT_SECRET || !PORT) {
    console.error("❌ Missing required environment variables.");
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/api/auth", auth_1.default);
app.use("/api/emissions", auth_2.authenticateJWT, emission_1.default);
app.use("/api/tokens", auth_2.authenticateJWT, tokens_1.default);
app.use("/api/admin", auth_2.authenticateJWT, admin_1.default);
console.log("PORT:", PORT);
console.log("MONGO_URI:", MONGO_URI ? "✓" : "❌ MISSING");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓" : "❌ MISSING");
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log("Connected to Mongodb");
        app.listen(PORT, () => { console.log(`🚀 Server running on http://localhost:${PORT}`); });
    });
}
main();
