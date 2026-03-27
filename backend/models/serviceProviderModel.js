import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

   images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
    },

    services: [
      {
        type: String,
        required: true,
      },
    ],

    title: { type: String, required: true },
    bio: { type: String, maxLength: 500 },
    experience: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },

    serviceRadius: { type: Number, default: 10 },
    languages: [String],
    hasTools: { type: Boolean, default: true },

    address: String,
    city: String,
    zipCode: String,

    availability: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema,
);
