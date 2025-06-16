import Transaction from '../models/Transaction.js';

// POST: Create a new transaction
export const createTransaction = async (req, res) => {
  const { type, message, hash, timestamp } = req.body;

  if (!type || !message || !timestamp) {
    return res.status(400).json({ error: 'Type, message, and timestamp are required' });
  }

  try {
    const newTransaction = new Transaction({
      id: Date.now(), // Using current timestamp as a unique ID
      type,
      message,
      pvtkey: req.body.pvtkey || null, // Optional private key
      hash: hash || null,
      timestamp
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction', details: err.message });
  }
};
// GET: Fetch last 10 transactions (latest first)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: err.message });
  }
};






// copilot:
// GET: Fetch a specific transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transaction', details: err.message });
  }
};
// DELETE: Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction', details: err.message });
  }
};
// PUT: Update a transaction by ID
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, message, hash, timestamp } = req.body;

    const updatedTx = await Transaction.findByIdAndUpdate(
      id,
      { type, message, hash: hash || null, timestamp },
      { new: true }
    );

    if (!updatedTx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(updatedTx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction', details: err.message });
  }
};
// Export all controllers
export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  updateTransaction
};
// Compare this snippet from carbon-cred/mint/controllers/mintController.js:
// import MintRecord from "../models/MintRecord.js";
// import { ethers } from "ethers";
// import ContractABI from "../abi/YourABI.json" assert { type: "json" };
//
// // Setup provider, wallet, and contract
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);    