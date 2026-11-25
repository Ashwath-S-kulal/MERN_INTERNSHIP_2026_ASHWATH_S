import express from 'express';
import { keepBrevoAlive } from '../controller/brevo.Controller';

const router = express.Router();

router.get("/", keepBrevoAlive);

export default router;