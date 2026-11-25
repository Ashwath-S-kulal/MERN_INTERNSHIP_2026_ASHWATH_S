import express from 'express';
import { keepBrevoAlive } from '../controller/brevo.Controller.js';

const router = express.Router();

router.get("/", keepBrevoAlive);

export default router;