import { ServiceProvider } from "../models/serviceProviderModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

import { SERVICE_GROUPS } from "../utils/serviceGroups.js";

export const applyProvider = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required." });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "service_providers" },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(file.buffer);
      });
    });
    const uploadedImages = await Promise.all(uploadPromises);

    const services = req.body.services ? JSON.parse(req.body.services) : [];
    
    const primaryService = services[0]; 
    const detectedCategory = SERVICE_GROUPS[primaryService] || "Other Services";

    const cleanData = {
      ...req.body,
      user: userId,
      category: detectedCategory, 
      services: services,
      
      pricing: {
        rate: Number(req.body.rate) || 0,
        unit: req.body.unit || "hour"
      },

      experience: Number(req.body.experience) || 0,
      serviceRadius: Number(req.body.serviceRadius) || 10,
      hasTools: req.body.hasTools === "true" || req.body.hasTools === true,
      languages: req.body.languages ? JSON.parse(req.body.languages) : [],
      availability: req.body.availability ? JSON.parse(req.body.availability) : [],
      images: uploadedImages,
    };

    const provider = await ServiceProvider.create(cleanData);

    res.status(201).json({
      success: true,
      message: `Application submitted for ${detectedCategory}!`,
      provider,
    });
  } catch (err) {
    console.error("Apply Provider Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getProviderByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const providers = await ServiceProvider.find({ user: id }).populate(
      "user",
      "firstName lastName email phoneNo profilePic city address",
    );

    if (!providers || providers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No profiles found" });
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

export const updateServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { existingImages } = req.body;

    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const userUpdates = {};
    if (req.body.firstName) userUpdates.firstName = req.body.firstName;
    if (req.body.lastName) userUpdates.lastName = req.body.lastName;
    if (req.body.phoneNo) userUpdates.phoneNo = req.body.phoneNo;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(provider.user, userUpdates);
    }
    let updatedImages = [];
    if (existingImages) {
      let keepIds = [];
      try {
        keepIds = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
      } catch (e) {
        keepIds = [];
      }

      updatedImages = provider.images.filter((img) => keepIds.includes(img.public_id));

      const removedImages = provider.images.filter((img) => !keepIds.includes(img.public_id));
      for (const img of removedImages) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    } else {
      updatedImages = [...provider.images];
    }

    const safeParse = (data) => {
      if (!data) return undefined;
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (e) {
        return undefined;
      }
    };

    const excluded = [
      "services",
      "languages",
      "availability",
      "images",
      "user",
      "existingImages",
      "pricing",
    ];

    Object.keys(req.body).forEach((key) => {
      if (!excluded.includes(key) && req.body[key] !== undefined && typeof req.body[key] !== 'object') {
        provider[key] = req.body[key];
      }
    });

    if (req.body.services) provider.services = safeParse(req.body.services) || provider.services;
    if (req.body.languages) provider.languages = safeParse(req.body.languages) || provider.languages;
    if (req.body.availability) provider.availability = safeParse(req.body.availability) || provider.availability;

    if (req.body.pricing) {
      const p = safeParse(req.body.pricing);
      provider.pricing = {
        rate: p?.rate || provider.pricing.rate,
        unit: p?.unit || provider.pricing.unit,
      };
    } else if (req.body["pricing[rate]"]) {
      provider.pricing = {
        rate: Number(req.body["pricing[rate]"]),
        unit: req.body["pricing[unit]"] || provider.pricing.unit,
      };
    }

    const files = req.files || [];
    if (files.length > 0) {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "service_providers" },
            (error, result) => {
              if (error) reject(error);
              else resolve({ url: result.secure_url, public_id: result.public_id });
            }
          );
          stream.end(file.buffer);
        });
      });

      const newUploadedImages = await Promise.all(uploadPromises);
      updatedImages = [...updatedImages, ...newUploadedImages];
    }

    provider.images = updatedImages;
    await provider.save();

    const updatedProvider = await ServiceProvider.findById(id).populate("user");

    res.json({
      success: true,
      message: "Profile updated successfully",
      provider: updatedProvider,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleProvider = async (req, res) => {
  try {
    const { jobId } = req.params;
    const provider = await ServiceProvider.findById(jobId).populate({
      path: "user",
      select: "firstName lastName email profilePic phoneNo",
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service profile not found",
      });
    }
    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error("Error fetching single provider:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile details",
      error: error.message,
    });
  }
};
