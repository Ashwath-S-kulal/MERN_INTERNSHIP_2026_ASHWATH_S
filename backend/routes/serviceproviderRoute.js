import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { applyProvider, getProviderByUserId } from '../controller/serviceproviderController.js';

const router = express.Router();

router.post("/applyprovider", isAuthenticated, applyProvider);
router.get("/provider/:id",isAuthenticated, getProviderByUserId);


export default router;