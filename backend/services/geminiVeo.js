// services/geminiVeo.js
const fetch = require('node-fetch');
const GEMINI_API_KEY = process.env.GEMINI_VEO_API_KEY;

// Generate medical advice using Gemini
async function generateMedicalAdvice(symptoms) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are a medical assistant AI. 
Given the patient's symptoms, generate:

patient's symptoms are: ${symptoms}

1. SOAP notes:
- S (Subjective)
- O (Objective)
- A (Assessment)
- P (Plan)

2. Medical advice:
- illness (short diagnosis)

- homeRemedies (list)
- otcMedicines (list)
- redFlags (list of urgent symptoms)
- disclaimer

Return the response in **strict JSON format**, like this:

{
  "soap": {
    "S": "...",
    "O": "...",
    "A": "...",
    "P": "..."
  },
  "advice": {
    "illness": "...",
    "homeRemedies": ["...", "..."],
    "otcMedicines": ["...", "..."],
    "redFlags": ["...", "..."],
    "disclaimer": "..."
  }

}




`;

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
      illness: parsed.advice?.illness || 'Unknown',
      confidence: parsed.confidence ? Number(parsed.confidence) : 0,
      homeRemedies: parsed.advice?.homeRemedies || [],
      otcMedicines: parsed.advice?.otcMedicines || [],
      redFlags: parsed.advice?.redFlags || [],
      disclaimer: parsed.advice?.disclaimer || 'This advice is for educational purposes only.'
    };
  } catch {
    return { illness: 'Unknown', confidence: 'N/A', homeRemedies: [], otcMedicines: [], redFlags: [], disclaimer: 'This advice is for educational purposes only.' };
  }
}

// Export only the function we need
module.exports = { generateMedicalAdvice };
