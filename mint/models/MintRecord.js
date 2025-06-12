import mongoose from 'mongoose';

const MintRecordSchema = new mongoose.Schema({
  mintAmount: { type: String, required: true },
  mintRecipient: { type: String, required: true },
//  txHash: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MintRecord', MintRecordSchema);
