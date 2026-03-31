import express from "express";
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  getSingleBooking,
  getBookedSlots,
  assignWorkerToBooking,
  getAllBookingsAdmin,
  settleBooking,
  confirmPayment,
  cancelBooking,
} from "../controller/bookingController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();

router.post("/create", isAuthenticated, createBooking);
router.get("/user", isAuthenticated, getUserBookings);
router.get("/provider", isAuthenticated, getProviderBookings);
router.put("/status/:id", isAuthenticated, updateBookingStatus);
router.put("/cancel/:id", isAuthenticated, cancelBooking);
router.get("/single/:id", isAuthenticated, getSingleBooking);
router.get("/slots", isAuthenticated, getBookedSlots);
router.put("/memberassign", isAuthenticated, assignWorkerToBooking);
router.get("/allbookings", isAuthenticated,isAdmin, getAllBookingsAdmin);
router.put("/settle/:id", isAuthenticated, settleBooking);
router.put("/confirm-payment/:id", isAuthenticated, confirmPayment);

export default router;