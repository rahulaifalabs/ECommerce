// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
