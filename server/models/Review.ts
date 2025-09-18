// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
