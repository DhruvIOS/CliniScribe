const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { findYouTubeVideo, generateMedicalAdvice } = require('../services/geminiVeo');
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { userId, inputType, symptoms, transcript, soap, advice, location } = req.body;

    // --- Fetch nearby places from Google Maps ---
    let formattedNearby = [];
    if (location?.lat && location?.lng) {
      try {
        const resp = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
          {
            params: {
              location: `${location.lat},${location.lng}`,
              radius: 5000,
              type: 'pharmacy',
              key: process.env.GOOGLE_MAPS_API_KEY,
            },
          }
        );
        if (resp.data?.results) {
          formattedNearby = resp.data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
          }));
        }
      } catch (err) {
        console.error("❌ Failed to fetch nearby places:", err.message);
      }
    }

    // --- Generate YouTube video URL ---
    const videoUrl = await findYouTubeVideo(symptoms);

    // --- Generate medical advice fields ---
    const medicalAdvice = await generateMedicalAdvice(symptoms);

    // --- Save consultation ---
    const consultation = await Consultation.create({
      userId,
      inputType,
      symptoms,
      transcript,
      soap,
      advice: {
        ...advice,
        videoUrl,
        homeRemedies: medicalAdvice.homeRemedies,
        otcMedicines: medicalAdvice.otcMedicines,
        redFlags: medicalAdvice.redFlags,
        disclaimer: "This advice is for educational purposes only."
      },
      location,
      nearby: formattedNearby
    });

    res.json(consultation);
  } catch (err) {
    console.error("❌ Consultation error:", err);
    res.status(500).json({ error: err.message, details: err });
  }
});

module.exports = router;
