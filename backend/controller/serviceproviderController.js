import { ServiceProvider } from "../models/serviceProviderModel.js";
import mongoose from "mongoose"; 
import { User } from "../models/userModel.js";


export const applyProvider = async (req, res) => {
  try {
    const userId = req.user._id;

    const provider = await ServiceProvider.create({
      user: userId,
      ...req.body, // Spread the body to catch all new fields
    });

    res.status(201).json({ 
      success: true, 
      message: "Application submitted successfully! Our team will review it.",
      provider 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProviderByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const providers = await ServiceProvider.find({ user: id }).populate(
      "user",
      "firstName lastName email phoneNumber profilePicture"
    );

    if (!providers || providers.length === 0) {
      return res.status(404).json({ success: false, message: "No profiles found" });
    }

    res.status(200).json({
      success: true,
      providers, 
    });
  } catch (err) {
    console.error("Backend Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};