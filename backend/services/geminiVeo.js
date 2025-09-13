const fetch = require('node-fetch');
const GEMINI_API_KEY = process.env.GEMINI_VEO_API_KEY;

// Existing function to find a YouTube video
async function findYouTubeVideo(symptoms) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Find a relevant educational YouTube video URL for the following symptoms: ${symptoms}. Only respond with a valid YouTube embed link.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`Gemini error: ${resp.status} ${error.error.message}`);
  }

  const data = await resp.json();

  // Extract text from Gemini response
  const videoText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  // Clean it if Gemini returned JSON string
  try {
    const parsed = JSON.parse(videoText);
    return parsed.video_url || parsed.url || videoText;
  } catch {
    return videoText;
  }
}

// NEW: Generate home remedies, OTC meds, red flags
async function generateMedicalAdvice(symptoms) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Provide concise medical advice for the following symptoms: ${symptoms}.
Return a JSON with these keys: 
{
  "homeRemedies": ["list of remedies"],
  "otcMedicines": ["list of over-the-counter medicines"],
  "redFlags": ["symptoms that need urgent care"]
}. Only return valid JSON, do not add explanations.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`Gemini error: ${resp.status} ${error.error.message}`);
  }

  const data = await resp.json();

  const adviceText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    const parsed = JSON.parse(adviceText);
    return {
      homeRemedies: parsed.homeRemedies || [],
      otcMedicines: parsed.otcMedicines || [],
      redFlags: parsed.redFlags || []
    };
  } catch {
    return { homeRemedies: [], otcMedicines: [], redFlags: [] };
  }
}

module.exports = { findYouTubeVideo, generateMedicalAdvice };
