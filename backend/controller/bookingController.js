import Booking from "../models/bookingModel.js";
import { ServiceProvider } from "../models/serviceProviderModel.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { providerId, date, time, address } = req.body;

    if (!providerId || !date || !time || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔍 find provider
    const provider = await ServiceProvider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // ❗ SLOT CHECK
    const existingBooking = await Booking.findOne({
      provider: provider._id,
      date,
      time,
      status: { $in: ["pending", "accepted", "in_progress"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "❌ This slot is already booked",
      });
    }

    // ✅ CREATE BOOKING
    const booking = await Booking.create({
      user: req.user.id,
      provider: provider._id,
      date,
      time,
      address,
      price: provider.hourlyRate,
      serviceType: provider.services?.[0] || "general",
    });

    res.status(201).json({
      message: "✅ Booking created",
      booking,
    });

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate({
        path: "provider",
        select: "title services hourlyRate",
        populate: {
          path: "user",
          select: "firstName lastName profilePic",
        },
      });

    res.status(200).json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


export const getProviderBookings = async (req, res) => {
  try {
    // ✅ 1. Get ALL providers for this user
    const providers = await ServiceProvider.find({
      user: req.user.id,
    });

    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: "No providers found" });
    }

    // ✅ 2. Extract all provider IDs
    const providerIds = providers.map((p) => p._id);


    // ✅ 3. Fetch bookings for ALL provider IDs
    const bookings = await Booking.find({
      provider: { $in: providerIds },
    })
      .populate({
        path: "user",
        select: "firstName lastName email profilePic",
      })
      .populate({
        path: "provider",
        select: "title services hourlyRate",
      });


    res.status(200).json(bookings);

  } catch (error) {
    console.error("Provider Bookings Error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// UPDATE STATUS
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// GET SINGLE BOOKING
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

      // ✅ Populate booking user (customer)
      .populate({
        path: "user",
        select: "firstName lastName email profilePic phoneNo",
      })

      // ✅ Populate provider + nested user
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "firstName lastName email profilePic phoneNo",
        },
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

// GET BOOKED SLOTS
export const getBookedSlots = async (req, res) => {
  try {
    const { providerId, date } = req.query;

    const bookings = await Booking.find({
      provider: providerId,
      date,
      status: { $in: ["pending", "accepted", "in_progress"] },
    });

    const bookedTimes = bookings.map((b) => b.time);

    res.json(bookedTimes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots" });
  }
};