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

// import MintRecord from "../models/MintRecord.js";
// import { ethers } from "ethers";
// import ContractABI from "../abi/YourABI.json" assert { type: "json" };

// // Setup provider, wallet, and contract
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ContractABI, wallet);

// export const submitMintRecord = async (req, res) => {
//   const { mintAmount, mintRecipient } = req.body;

//   if (!mintAmount || !mintRecipient) {
//     return res.status(400).json({ message: "mintAmount and mintRecipient are required" });
//   }

//   try {
//     // 1. Call the smart contract
//     const tx = await contract.mint(mintRecipient, ethers.parseEther(mintAmount));
//     await tx.wait(); // Wait for transaction confirmation

//     // 2. Save mintAmount, mintRecipient, and tx.hash to DB
//     const record = await MintRecord.create({
//       mintAmount,
//       mintRecipient,
//       txHash: tx.hash, // ✅ Save txHash
//     });

//     res.status(201).json(record);
//   } catch (error) {
//     console.error("Mint error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
