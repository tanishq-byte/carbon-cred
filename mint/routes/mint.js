import express from 'express';
import { submitMintRecord, getAllMintRecords } from "../controllers/mintController.js";

const router = express.Router();

router.post("/submit", submitMintRecord);
router.get("/all", getAllMintRecords);

export default router;
