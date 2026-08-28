import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const websiteInformation = `
You are the AI assistant for Portfolio Builder.

Portfolio Builder is a website that helps users create and manage
professional portfolios.

The website contains features/components related to:
- Portfolio creation
- User profile
- Templates
- Dashboard
- Projects/work showcase
- Preview
- Business information
- Contact information

Your job is to answer questions about the Portfolio Builder website.

IMPORTANT RULES:
1. Answer only questions related to Portfolio Builder.
2. Use only the information provided in this context.
3. Do not invent features, prices, policies, or functionality.
4. If you don't know the answer, say:
   "I'm not sure about that. Please contact the website team for more information."
5. Keep answers clear, short, and helpful.
6. If the user asks something unrelated to Portfolio Builder, politely
   tell them that you can only help with Portfolio Builder.
`;

export const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    const prompt = `
${websiteInformation}

Visitor's question:
${message}

Answer the visitor:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = response.text;

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Sorry, I couldn't process your question right now.",
    });
  }
};