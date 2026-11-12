
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Complaint title and description are required.",
      });
    }

    const prompt = `
You are an AI assistant for the CM Kerala Grievance Portal.

Analyze this citizen complaint:

Title: ${title}
Description: ${description}

Return a JSON object with these fields:
{
  "category": "Suggested complaint category",
  "department": "Suggested government department",
  "priority": "Low, Medium, High, or Critical",
  "summary": "Short summary for the CMO",
  "duplicate_flag": false,
  "duplicate_reason": "Reason or explanation"
}

Set duplicate_flag to true only if the complaint itself indicates
a possible duplicate. Do not claim certainty.
Return JSON only.
`;

    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
      contents: prompt,
    });

    const resultText = response.text
      .replace(/```json|```/g, "")
      .trim();

    const analysis = JSON.parse(resultText);

    res.json({
      success: true,
      analysis,
    });

  } catch (error) {
  console.error("Gemini AI error:", error);

  res.status(500).json({
    message: error.message || "AI analysis failed",
  });

  }
});

module.exports = router;
