import Booking from "../models/bookingModel.js";
import { ServiceProvider } from "../models/serviceProviderModel.js";

export const createBooking = async (req, res) => {
  try {
    const { 
      providerId, 
      date, 
      problemDescription, 
      address, 
      urgency ,
      unit,
    } = req.body;

    if (!providerId || !date || !problemDescription || !address?.houseNo || !address?.area) {
      return res.status(400).json({ 
        message: "Please provide the date, problem details, and full address." 
      });
    }

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      provider: provider._id,
      date,
      problemDescription, 
      urgency: urgency || "medium", 
      address: {
        houseNo: address.houseNo,
        landmark: address.landmark,
        area: address.area,
        pincode: address.pincode,
        city: address.city || provider.city 
      },
      price: provider.pricing?.rate || provider.hourlyRate || 0,
      unit: unit || provider.pricing?.unit || "hr",
      serviceType: provider.services?.[0] || "General Service",
      status: "pending",
    });

    res.status(201).json({
      message: "Service request sent successfully!",
      booking,
    });

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Internal server error while creating request" });
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
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getProviderBookings = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({
      user: req.user.id,
    });

    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: "No providers found" });
    }

    const providerIds = providers.map((p) => p._id);

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
      })
      .populate({
        path: "cancelledBy",
        select: "firstName lastName profilePic role",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Provider Bookings Error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body; 
    
    const cancelledBy = req.user ? req.user._id : null;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        cancellationReason: cancellationReason, 
        cancelledBy: cancelledBy,
        isWorkerAssigned: false, 
        assignedWorker: null 
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ message: "Error cancelling the order" });
  }
};

export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

      .populate({
        path: "user",
        select: "firstName lastName email profilePic phoneNo",
      })

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

export const assignWorkerToBooking = async (req, res) => {
  try {
    const { bookingId, workerId } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        assignedWorker: workerId,
        isWorkerAssigned: true,
        status: "accepted",
      },
      { new: true },
    ).populate("assignedWorker");

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "user",
        select: "firstName lastName email profilePic",
      })
      .populate({
        path: "provider",
        select: "title services hourlyRate",
        populate: {
          path: "user",
          select: "firstName lastName profilePic",
        },
      })
      .sort({ createdAt: -1 });

    if (!bookings) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin Bookings Error:", error);
    res.status(500).json({ message: "Error fetching all bookings" });
  }
};

export const settleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, extraCharges } = req.body; 
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    let baseAmount = 0;
    let finalQuantity = parseFloat(quantity) || 0;

    if (booking.unit === "visit") {
      baseAmount = booking.price;
      finalQuantity = 1; 
    } else {
      if (!finalQuantity || finalQuantity <= 0) {
        return res.status(400).json({ 
          message: `Valid ${booking.unit} count is required for this service.` 
        });
      }
      baseAmount = finalQuantity * booking.price;
    }

    const extrasTotal = Array.isArray(extraCharges) 
      ? extraCharges.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
      : 0;

    const totalAmount = baseAmount + extrasTotal;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        hoursWorked: finalQuantity, 
        extraCharges: extraCharges || [], 
        totalAmount: totalAmount,
        isSettled: true,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Settlement Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        paymentStatus: "paid",
        updatedAt: Date.now(),
      },
      { new: true },
    );

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
