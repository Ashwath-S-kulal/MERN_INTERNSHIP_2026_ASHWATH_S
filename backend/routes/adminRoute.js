import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { updateProviderStatus, getPendingProviders, rejectProvider, getAllProviders } from '../controller/adminController.js';
import { allUser, deleteUser, updateUser } from '../controller/userController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.get("/pending", isAuthenticated, isAdmin, getPendingProviders);
router.get("/allprovider", isAuthenticated, isAdmin, getAllProviders);
router.patch("/approve/:id", isAuthenticated, isAdmin, updateProviderStatus);
router.patch("/reject/:id", isAuthenticated, isAdmin, rejectProvider);
router.get('/alluser',isAuthenticated,isAdmin,allUser);
router.put('/updateuser/:id',isAuthenticated,singleUpload,updateUser);
router.delete('/deleteuser/:id',isAuthenticated,isAdmin,deleteUser);


export default router;