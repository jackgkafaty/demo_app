// ...existing code...
const mongoose = require('mongoose');

const FinancialEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['asset', 'expense', 'budget', 'retirement', 'tfsa', 'stock'], required: true },
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('FinancialEntry', FinancialEntrySchema);
// ...existing code...
