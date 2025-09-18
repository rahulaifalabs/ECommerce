// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
