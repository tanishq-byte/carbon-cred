import MintRecord from "../models/MintRecord.js";

export const submitMintRecord = async (req, res) => {
  const { mintAmount, mintRecipient } = req.body;

  if (!mintAmount || !mintRecipient) {
    return res.status(400).json({ message: "mintAmount and mintRecipient are required" });
  }

  try {
    const record = await MintRecord.create({ mintAmount, mintRecipient });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllMintRecords = async (_req, res) => {
  try {
    const records = await MintRecord.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
