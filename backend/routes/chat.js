import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The new endpoint for handling chat messages
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are EventBot, a helpful assistant for a university club event management platform called Eventify. 
                     Your goal is to answer user questions about events. 
                     You should be friendly and concise. 
                     When asked about how to register, view events, or find registered events, guide them to the 'Events' or 'Dashboard' pages.
                     The platform has two user roles: 'student' and 'admin'.`,
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo", // This model is fast and cheap
    });

    const botResponse = completion.choices[0].message.content;
    res.json({ reply: botResponse });

  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

export default router;
