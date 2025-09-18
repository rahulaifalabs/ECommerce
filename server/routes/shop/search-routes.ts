// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const express = require("express");

const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;
