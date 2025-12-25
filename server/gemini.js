const axios = require('axios');
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
// UPDATED: Using the specific model from your list
//const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// To this (The "Always Working" version):
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

async function callGemini(promptText) {
  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }]
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000 
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error.response ? error.response.data : error.message);
    return null;
  }
}

// FUNCTION 1: Turn User Chat into Data (JSON)
async function extractSearchIntents(userQuery) {
  const prompt = `
    You are an API that extracts search parameters from user input.
    Analyze the user's query: "${userQuery}"
    
    Return ONLY a JSON object with these fields (if mentioned):
    - category (string, e.g., "shirt", "pants")
    - color (string)
    - budget (number)
    - size (string, e.g., "M", "L", "40")
    - style (string, e.g., "casual", "formal")
    
    If a field is missing, omit it. Do NOT add markdown formatting like \`\`\`json. Just the raw JSON string.
  `;

  const text = await callGemini(prompt);
  if (!text) return {};

  try {
    const cleanText = text.replace(/```json|```/g, "").trim(); 
    return JSON.parse(cleanText);
  } catch (error) {
    return {}; 
  }
}

// FUNCTION 2: Sell the Product (Chat)
async function generateStylistResponse(userQuery, matchedProducts) {
  const prompt = `
    You are StyleSync, an expert fashion stylist.
    User Query: "${userQuery}"
    I have found these products in our inventory that match:
    ${JSON.stringify(matchedProducts, null, 2)}
    
    Your Task:
    1. Recommend these specific items.
    2. Explain briefly WHY they fit the user's request.
    3. Be encouraging and concise.
  `;

  const text = await callGemini(prompt);
  return text || "I'm having trouble connecting to the stylist right now.";
}

module.exports = { extractSearchIntents, generateStylistResponse };