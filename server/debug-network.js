// server/debug-network.js
require("dotenv").config();

async function checkInternet() {
  console.log("1. Checking Google connectivity...");
  try {
    // Try to hit Google directly (bypassing the SDK)
    const response = await fetch("https://generativelanguage.googleapis.com");
    console.log("✅ SUCCESS: Connected to Google! Status:", response.status);
    
    console.log("2. Checking API Key Validity...");
    // Only prints first 10 chars for safety
    console.log("   Key being used:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "UNDEFINED");
    
  } catch (error) {
    console.error("❌ FAILURE: Could not reach Google.");
    console.error("   Reason:", error.message);
    console.error("   Cause:", error.cause);
  }
}

checkInternet();