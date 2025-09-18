// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
