import express from "express";
import {
  aiChat,
  getSessions,
  getSessionById,
  deleteChatSession
} from "../controller/aiController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/chat",isAuthenticated, aiChat);
router.get("/sessions/:userId",isAuthenticated, getSessions);
router.get("/session/:sessionId", isAuthenticated, getSessionById);
router.delete("/delete/:sessionId",isAuthenticated, deleteChatSession);

export default router;