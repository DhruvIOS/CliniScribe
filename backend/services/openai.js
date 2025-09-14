// openai.js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate SOAP notes and medical advice from a transcript
 * @param {string} transcript - Patient symptoms or description
 * @returns {Promise<Object>} - { soap, advice }
 */
async function generateSOAPAdvice(transcript) {
  try {
    const prompt = `
You are a medical assistant AI. 
Given the patient's symptoms or transcript, generate:

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

Patient transcript: """${transcript}"""
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or gpt-4o / gpt-4
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2, // keep low for factual advice
      max_tokens: 800,
    });

    const text = completion.choices[0].message.content;

    // Parse JSON safely
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.warn('⚠️ Failed to parse AI response as JSON. Returning stub data.');
      return {
        soap: {
          S: transcript,
          O: 'Temperature 101°F, no rash, alert',
          A: 'Likely viral fever',
          P: 'Rest, fluids, paracetamol 500mg',
        },
        advice: {
          illness: 'Likely viral fever',
          homeRemedies: ['Rest', 'Drink fluids', 'Cool compress'],
          otcMedicines: ['Paracetamol'],
          redFlags: ['High fever >104°F', 'Severe headache', 'Confusion'],
          disclaimer: 'This is general advice, not a medical prescription.',
        },
      };
    }

    return result;
  } catch (err) {
    console.error('❌ Error generating SOAP advice:', err.message);
    // fallback stub
    return {
      soap: {
        S: transcript,
        O: 'Temperature 101°F, no rash, alert',
        A: 'Likely viral fever',
        P: 'Rest, fluids, paracetamol 500mg',
      },
      advice: {
        illness: 'Likely viral fever',
        homeRemedies: ['Rest', 'Drink fluids', 'Cool compress'],
        otcMedicines: ['Paracetamol'],
        redFlags: ['High fever >104°F', 'Severe headache', 'Confusion'],
        disclaimer: 'This is general advice, not a medical prescription.',
      },
    };
  }
}

module.exports = { generateSOAPAdvice };
