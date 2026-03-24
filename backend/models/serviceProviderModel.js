import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    services: [{
      type: String,
      enum: ["plumber", "electrician", "cleaning", "ac_repair", "painting", "carpentry", "pest_control"],
      required: true
    }],
    title: { type: String, required: true }, // e.g., "Master Electrician"
    bio: { type: String, maxLength: 500 },
    experience: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    
    // NEW DATA POINTS
    serviceRadius: { type: Number, default: 10 }, // in km
    languages: [String], // ["English", "Hindi"]
    hasTools: { type: Boolean, default: true },
    
    address: String,
    city: String,
    zipCode: String,
    
    // Availability mapping (Simplified)
    availability: {
      type: [String], // ["Monday", "Tuesday", "Wednesday"]
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isActive: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);