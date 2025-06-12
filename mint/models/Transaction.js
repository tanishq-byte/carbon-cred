import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // optional, ensures no duplicates
 },
  type: {
    type: String,
    enum: ['success', 'error'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  pvtkey: {
    type: String,
    default: null,
  },
  hash: {
    type: String,
    default: null,
  },
  timestamp: {
    type: String, // using toLocaleTimeString() format
    required: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// const Transaction = mongoose.model('Transaction', transactionSchema);

// export default Transaction;
export default mongoose.model('Transaction', transactionSchema);
