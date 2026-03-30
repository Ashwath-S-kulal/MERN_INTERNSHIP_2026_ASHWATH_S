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
} from "../controller/bookingController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();

router.post("/create", isAuthenticated, createBooking);
router.get("/user", isAuthenticated, getUserBookings);
router.get("/provider", isAuthenticated, getProviderBookings);
router.put("/status/:id", isAuthenticated, updateBookingStatus);
router.get("/single/:id", isAuthenticated, getSingleBooking);
router.get("/slots", isAuthenticated, getBookedSlots);
router.put("/memberassign", isAuthenticated, assignWorkerToBooking);
router.get("/allbookings", isAuthenticated,isAdmin, getAllBookingsAdmin);

export default router;