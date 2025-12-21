const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    // Clean up if Gemini adds markdown code blocks by accident
    const cleanText = text.replace(/```json|```/g, ""); 
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return {}; // Return empty object on fail
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
    2. Explain briefly WHY they fit the user's request (style, budget, etc).
    3. Be encouraging and concise.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { extractSearchIntents, generateStylistResponse };