import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phoneNo: { type: String },

    profilePic: { type: String, default: "" },
    profilePicPublicId: { type: String, default: "" },

    role: {
      type: String,
      enum: ["user", "provider", "admin"], 
      default: "user",
    },

    services: [
      {
        type: String, 
      },
    ],

    experience: { type: Number, default: 0 }, 
    hourlyRate: { type: Number, default: 0 },

    isApproved: { type: Boolean, default: false },

    address: { type: String },
    city: { type: String },
    zipCode: { type: String },

    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);