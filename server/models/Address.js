const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who owns the address
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "India" },
  landmark: { type: String },
  pincode: { type: String, required: true },
  altPhone: { type: String },
  addressType: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
  isDefault: { type: Boolean, default: false }, // If this is the user's default address
  isActive: { type: Boolean, default: true },
},
  { timestamps: true });

module.exports = {
  Address: mongoose.model("Address", addressSchema),
};
