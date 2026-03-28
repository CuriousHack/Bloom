const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cooperative: { type: mongoose.Schema.Types.ObjectId, ref: 'Cooperative', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: String,
  monthKey: { type: String } // e.g., "March 2026" for easy grouping
});

module.exports = mongoose.model('Contribution', ContributionSchema);