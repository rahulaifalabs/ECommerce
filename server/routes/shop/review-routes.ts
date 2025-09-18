// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
