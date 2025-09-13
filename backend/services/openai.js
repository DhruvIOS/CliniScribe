const axios = require('axios');

// Whisper: audio (base64 or file URL) → transcript
async function transcribeAudio(audio) {
  // TODO: Integrate OpenAI Whisper API
  // This is a stub:
  return 'I have a fever and headache since last night.';
}

// GPT: transcript → SOAP + advice
async function generateSOAPAdvice(transcript) {
  // TODO: Integrate OpenAI GPT API with proper prompt engineering
  // Example prompt (send transcript, ask for SOAP + advice)
  // This is a stub:
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

module.exports = { transcribeAudio, generateSOAPAdvice };