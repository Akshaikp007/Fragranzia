const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // default role
    });

    res.status(201).json({ message: "Registered Successfully", userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1y" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const home = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Welcome to Home Page", user });
  } catch (error) {
    console.error("Home route error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, email, phone, dob, gender } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone, dob, gender },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("updateMe error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json({ customers });
  } catch (error) {
    console.error("getAllCustomers error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Access Denied: Cannot modify admin status" });
    }
    user.status = user.status === undefined ? false : !user.status;
    await user.save();
    res.json({ message: `Customer status updated successfully`, user });
  } catch (error) {
    console.error("toggleCustomerStatus error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token, access_token } = req.body;
    const googleToken = access_token || token;
    if (!googleToken) {
      return res.status(400).json({ message: "Google token is required" });
    }

    let googleId, email, name, picture;

    try {
      const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      googleId = googleRes.data.sub;
      email = googleRes.data.email;
      name = googleRes.data.name;
      picture = googleRes.data.picture;
    } catch (userInfoError) {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (user.status === undefined || user.status === false) {
        user.status = true;
      }
      await user.save();
    } else {
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
        image: picture,
        role: "user",
        status: true,
      });
    }

    if (user.status === false) {
      return res.status(403).json({ message: "Your account has been deactivated" });
    }

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    res.status(400).json({ message: "Google Authentication failed" });
  }
};

module.exports = {
  register,
  login,
  home,
  getMe,
  updateMe,
  getAllCustomers,
  toggleCustomerStatus,
  googleAuth
};

