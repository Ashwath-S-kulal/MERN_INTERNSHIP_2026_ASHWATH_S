import client from "../utils/groq.js";
import { ChatSession } from "../models/ChatSession.js";

export const aiChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.id;

    if (!message || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    let session;
    if (sessionId && sessionId !== "null" && sessionId !== "undefined") {
      session = await ChatSession.findById(sessionId);
    }

    if (!session) {
      session = new ChatSession({
        userId,
        title: message.substring(0, 35) + "...",
        messages: [],
      });
    }

    const history = session.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content, 
    }));

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful home service assistant for Service Mate.",
        },
        ...history,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    session.messages.push({ role: "user", content: message });
    session.messages.push({ role: "assistant", content: reply });

    await session.save();

    res.json({ success: true, reply, sessionId: session._id });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const userId = req.id;
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Chat session not found" });
    }

    if (session.userId.toString() !== req.id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.json({ success: true, messages: session.messages });
  } catch (err) {
    console.error("Get Session Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error retrieving chat" });
  }
};

export const deleteChatSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const userId = req.id; 

        const session = await ChatSession.findById(sessionId);
        console.log("Delete Session:", session.userId);
        console.log("Delete Session:", userId);

        if (!session) {
            return res.status(404).json({
                message: "Chat session not found",
                success: false
            });
        }
        if (session.userId.toString() !== userId.toString()) {
            return res.status(401).json({
                message: "You do not have permission to delete this chat",
                success: false
            });
        }

        await ChatSession.findByIdAndDelete(sessionId);

        return res.status(200).json({
            message: "Chat history deleted",
            success: true
        });
    } catch (error) {
        console.error("Delete Chat Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};