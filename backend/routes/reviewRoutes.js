import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { createReview, deleteReview, getAllReviewsAdmin, getProviderReviews, getProviderReviewsByServices, getReviewByBookingId, updateReviewByBookingId } from '../controller/reviewController.js';

const router = express.Router();

router.post('/create', isAuthenticated, createReview);
router.get('/provider/:providerId',isAuthenticated, getProviderReviews);
router.get("/booking/:id", isAuthenticated, getReviewByBookingId);
router.put('/update/booking/:bookingId', isAuthenticated, updateReviewByBookingId);
router.get('/admin/all', isAuthenticated, isAdmin, getAllReviewsAdmin);
router.delete('/admin/delete/:id', isAuthenticated, isAdmin, deleteReview);
router.get('/providerreviews/:userId', isAuthenticated, getProviderReviewsByServices);

export default router;