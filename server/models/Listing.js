const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uniqueId: { type: String, required: true }, // Scoped to community
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  isBoosted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
