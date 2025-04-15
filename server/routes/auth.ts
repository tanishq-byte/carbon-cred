// server/routes/auth.ts
import express from "express";
import { loginUser, registerUser } from "../controllers/authController";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTRhNzBjZTI4MzYwNjcwZTliMTkiLCJyb2xlIjoiY3JlZGl0LWhvbGRlciIsImlhdCI6MTc0NDc0MTY2M30.n1W6HWEP1iFWROXiqzK2PWpQEWNyJ6T0ZlysA74t1h0",
//     "role": "credit-holder"
// }