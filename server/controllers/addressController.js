const { Address } = require("../models/Address");

// Get all active addresses for the logged-in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ message: "Server error while fetching addresses" });
  }
};

// Add a new address
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      country,
      landmark,
      pincode,
      altPhone,
      addressType,
      isDefault
    } = req.body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // If isDefault is true, unset default on other addresses of this user
    if (isDefault) {
      await Address.updateMany({ user: req.userId }, { isDefault: false });
    }

    const newAddress = new Address({
      user: req.userId,
      fullName,
      phone,
      street,
      city,
      state,
      country: country || "India",
      landmark,
      pincode,
      altPhone,
      addressType: addressType || "Home",
      isDefault: !!isDefault
    });

    await newAddress.save();

    const addresses = await Address.find({ user: req.userId, isActive: true }).sort({ createdAt: -1 });
    res.status(201).json({ message: "Address added successfully", addresses });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Server error while adding address" });
  }
};

// Soft-delete an address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isActive: false },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    const addresses = await Address.find({ user: req.userId, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Address deleted successfully", addresses });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Server error while deleting address" });
  }
};

// Set an address as primary (default)
const setPrimaryAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    // Check if address exists, belongs to the user, and is active
    const address = await Address.findOne({ _id: addressId, user: req.userId, isActive: true });
    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    // Set all other active addresses of this user to isDefault: false
    await Address.updateMany({ user: req.userId }, { isDefault: false });

    // Set this address to isDefault: true
    address.isDefault = true;
    await address.save();

    const addresses = await Address.find({ user: req.userId, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Address set as primary successfully", addresses });
  } catch (error) {
    console.error("Set primary address error:", error);
    res.status(500).json({ message: "Server error while setting primary address" });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress,
  setPrimaryAddress
};
