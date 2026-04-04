import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    address: {
      houseNo: { type: String, required: true },
      landmark: { type: String },
      area: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    problemDescription: { type: String },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    serviceType: { type: String },
    unit: { type: String },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    cancellationReason: {
      type: String,
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["user", "provider", "admin", null],
      default: null,
    },

    isWorkerAssigned: {
      type: Boolean,
      default: false,
    },

    hoursWorked: {
      type: Number,
      default: 0,
    },
    
    extraCharges: [
      {
        name: { type: String },
        price: { type: Number, default: 0 },
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "pending_collection"],
      default: "pending",
    },

    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
