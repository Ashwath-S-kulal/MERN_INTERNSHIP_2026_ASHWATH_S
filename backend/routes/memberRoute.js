import express from 'express';
import {  isAuthenticated } from '../middleware/isAuthenticated.js';
import { addmember, deleteMember, getmember, getMemberById } from '../controller/memberController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post("/add", isAuthenticated,singleUpload, addmember );
router.get("/all", isAuthenticated, getmember );
router.get("/getbyid/:id", isAuthenticated, getMemberById );
router.delete('/delete/:id',isAuthenticated,deleteMember);


export default router;