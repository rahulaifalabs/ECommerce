// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;
