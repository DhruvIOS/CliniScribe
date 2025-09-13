// routes/video.js
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { findYouTubeVideo } = require('../services/geminiVeo');

router.post('/', async (req, res) => {
  try {
    const { userId, symptoms } = req.body;

    // Find YouTube video URL using Gemini service
    const videoUrl = await findYouTubeVideo(symptoms);

    const consultation = new Consultation({
      userId,
      symptoms,
      advice: {
        videoUrl, // proper string
        homeRemedies: [],
        otcMedicines: [],
        redFlags: [],
        disclaimer: "This advice is for educational purposes only."
      },
      location: req.body.location,
      nearby: req.body.nearby || []
    });

    await consultation.save();
    res.status(201).json({ consultation });
  } catch (err) {
    console.error('Consultation error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
