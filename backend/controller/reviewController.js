import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import { ServiceProvider } from "../models/serviceProviderModel.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed services" });
    }

    const review = await Review.create({
      booking: bookingId,
      user: req.user._id,
      provider: booking.provider,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this service" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("user", "firstName lastName profilePic")
      .sort("-createdAt");

    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewByBookingId = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({ booking: id });

    if (!review) {
      return res.status(200).json(null);
    }

    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching review", error: error.message });
  }
};

export const updateReviewByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const updatedReview = await Review.findOneAndUpdate(
      { booking: bookingId, user: userId },
      { rating, comment },
      { new: true, runValidators: true },
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you're not authorized to edit it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "user",
        select: "firstName lastName fullname profilePic email",
      })
      .populate({
        path: "booking",
        populate: {
          path: "provider",
          select:
            "title bio experience hourlyRate rating totalReviews images status city user",
          populate: {
            path: "user",
            select: "profilePic firstName lastName",
          },
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("ADMIN REVIEW FETCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getProviderReviewsByServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await ServiceProvider.find({ user: userId });

    if (!services || services.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const serviceIds = services.map((service) => service._id);
    const allReviews = await Review.find({
      $or: [{ provider: { $in: serviceIds } }, { provider: userId }],
    }).populate("user", "firstName lastName profilePic");

    res.status(200).json({
      success: true,
      count: allReviews.length,
      data: allReviews,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};
