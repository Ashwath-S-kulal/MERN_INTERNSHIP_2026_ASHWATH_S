import client from "../utils/groq.js";
import { ChatSession } from "../models/ChatSession.js";
import OpenAI from "openai";
import { ServiceProvider } from "../models/serviceProviderModel.js";
import Review from "../models/reviewModel.js";

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
        success: false,
      });
    }
    if (session.userId.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "You do not have permission to delete this chat",
        success: false,
      });
    }

    await ChatSession.findByIdAndDelete(sessionId);

    return res.status(200).json({
      message: "Chat history deleted",
      success: true,
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const handleAISearchIntent = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res
        .status(400)
        .json({ message: "Search query string is required" });
    }

    const dbCategories = await ServiceProvider.distinct("category", {
      status: "approved",
    });
    const dbCities = await ServiceProvider.distinct("city", {
      status: "approved",
    });
    const dbServices = await ServiceProvider.distinct("services", {
      status: "approved",
    });
    const dbLanguages = await ServiceProvider.distinct("languages", {
      status: "approved",
    });
    const dbAvailability = await ServiceProvider.distinct("availability", {
      status: "approved",
    });

    const statistics = await ServiceProvider.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          maxDbPrice: { $max: "$pricing.rate" },
          maxDbRadius: { $max: "$serviceRadius" },
          maxDbExperience: { $max: "$experience" },
        },
      },
    ]);

    const limits = statistics[0] || {
      maxDbPrice: 10000,
      maxDbRadius: 50,
      maxDbExperience: 25,
    };

    const systemPrompt = `You are the advanced semantic intent engine for ServiceMate.
Extract filtering parameters from the user's natural query phrase into a strict JSON payload.

Expected Output Schema:
{
  "category": "String matching available categories or 'All'",
  "services": ["Array of specific sub-service/skill strings requested, or empty array []"],
  "city": "String matching available cities or 'All'",
  "maxPrice": Number or null,
  "maxRadius": Number or null,
  "minExperience": Number or null,
  "hasTools": Boolean or null,
  "language": "String matching available languages or 'All'",
  "dayAvailable": "String matching available availability days or 'All'"
}

STRICT REFERENCE LISTS FROM DATABASE:
Platform Categories: ${JSON.stringify(dbCategories)}
Platform Cities: ${JSON.stringify(dbCities)}
Available Sub-Services/Skills: ${JSON.stringify(dbServices)}
Available Languages: ${JSON.stringify(dbLanguages)}
Available Availability Days: ${JSON.stringify(dbAvailability)}

UPPER LIMITS EXTRACTED FROM DATABASE (Do not exceed these numbers):
- Max Allowed Price: ₹${limits.maxDbPrice}
- Max Allowed Radius: ${limits.maxDbRadius}km
- Max Found Experience: ${limits.maxDbExperience} years

Rules:
- Match strings ("category", "city", "language", "dayAvailable") exactly to the arrays above. Fall back to "All" if no target matches.
- Match "services" array elements strictly to items inside "Available Sub-Services/Skills".
- If the extracted "maxPrice", "maxRadius", or "minExperience" exceeds the upper limits provided above, cap them exactly to those database limits.
- Output raw JSON ONLY. No markdown wrappers or backticks.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User query: "${query}"` },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const aiOutput = JSON.parse(
      chatCompletion.choices[0]?.message?.content || "{}",
    );

    const verifiedServices = Array.isArray(aiOutput.services)
      ? aiOutput.services.filter((svc) => dbServices.includes(svc))
      : [];

    const verifiedPrice =
      typeof aiOutput.maxPrice === "number"
        ? Math.min(aiOutput.maxPrice, limits.maxDbPrice)
        : null;

    const verifiedRadius =
      typeof aiOutput.maxRadius === "number"
        ? Math.min(aiOutput.maxRadius, limits.maxDbRadius)
        : null;

    const verifiedExperience =
      typeof aiOutput.minExperience === "number"
        ? Math.min(aiOutput.minExperience, limits.maxDbExperience)
        : null;

    const finalFilters = {
      category: dbCategories.includes(aiOutput.category)
        ? aiOutput.category
        : "All",
      services: verifiedServices,
      city: dbCities.includes(aiOutput.city) ? aiOutput.city : "All",
      maxPrice: verifiedPrice,
      maxRadius: verifiedRadius,
      minExperience: verifiedExperience,
      hasTools:
        typeof aiOutput.hasTools === "boolean" ? aiOutput.hasTools : null,
      language: dbLanguages.includes(aiOutput.language)
        ? aiOutput.language
        : "All",
      dayAvailable: dbAvailability.includes(aiOutput.dayAvailable)
        ? aiOutput.dayAvailable
        : "All",
    };

    res.status(200).json(finalFilters);
  } catch (error) {
    console.error("Advanced AI Search matching failed:", error);
    res.status(500).json({ message: "AI intent calculation failed" });
  }
};

export const getAIReviewSummary = async (req, res) => {
  const { providerId } = req.params;
  console.log("AI Summary Request for Provider ID:", providerId);

  try {
    const reviews = await Review.find({ provider: providerId }).select(
      "rating comment",
    );

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        summary: "Not enough reviews available to generate AI insights yet.",
        primaryStrength: "None detected",
        improvementArea: "None detected",
        tags: [],
        metrics: {
          total: 0,
          average: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      });
    }

    const totalReviews = reviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      sum += r.rating;
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });
    const averageRating = (sum / totalReviews).toFixed(1);

    const reviewContext = reviews
      .map((r, i) => `Review #${i + 1}: [Rating: ${r.rating}/5] "${r.comment}"`)
      .join("\n");

    const prompt = `
      You are an advanced data analyst for ServiceMate, an on-demand home services platform. 
      Analyze the customer reviews data below and provide a deep semantic takeaway.

      Rules:
      1. Write a 10-15 sentence comprehensive summary of customer sentiments.
      2. Identify the #1 strongest recurring capability/strength (e.g., punctuality, toolsets).
      3. Identify the #1 prominent area of improvement (or state "None detected").
      4. Respond STRICTLY in valid JSON format with exactly these four keys: 
         "summary" (string), "primaryStrength" (string), "improvementArea" (string), and "tags" (array of uppercase strings).
      
      Reviews data:
      ${reviewContext}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);

    return res.status(200).json({
      success: true,
      summary: aiResponse.summary,
      primaryStrength: aiResponse.primaryStrength || "None detected",
      improvementArea: aiResponse.improvementArea || "None detected",
      tags: aiResponse.tags || [],
      metrics: {
        total: totalReviews,
        average: parseFloat(averageRating),
        distribution: distribution,
      },
    });
  } catch (error) {
    console.error("Groq AI Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate comprehensive AI insights.",
    });
  }
};

export const genAIDesc = async (req, res) => {
  const { prompt } = req.body;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Convert user issue into professional service booking description.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  res.json({
    description: completion.choices[0].message.content,
  });
};
