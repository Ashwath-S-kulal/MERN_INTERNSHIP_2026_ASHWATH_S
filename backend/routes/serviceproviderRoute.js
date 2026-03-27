import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { applyProvider, getProviderByUserId, updateServiceProvider } from '../controller/serviceproviderController.js';
import { multipleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post("/applyprovider", isAuthenticated,multipleUpload, applyProvider);
router.get("/provider/:id",isAuthenticated, getProviderByUserId);
router.put("/update/:id",isAuthenticated,multipleUpload, updateServiceProvider);


export default router;