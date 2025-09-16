const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { generateMedicalAdvice } = require('../services/geminiVeo');
const { computeConfidence } = require('../services/confidence');
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { userId, inputType, symptoms, transcript, soap, advice, location } = req.body;

    // --- Fetch nearby places from Google Maps ---

// --- Fetch nearby pharmacies ---
let formattedNearby = [];
if (location?.lat && location?.lng) {
  try {
    const resp = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 5000, // 5 km
          type: 'pharmacy',
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (resp.data?.results?.length > 0) {
      const toRad = (v) => (v * Math.PI) / 180;
      const distKm = (lat1,lng1,lat2,lng2) => {
        const R = 6371; // km
        const dLat = toRad(lat2-lat1);
        const dLon = toRad(lng2-lng1);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
        const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R*c;
      };

      formattedNearby = resp.data.results.map(place => {
        const plat = place.geometry?.location?.lat || place.geometry?.location?.lat?.()
        const plng = place.geometry?.location?.lng || place.geometry?.location?.lng?.()
        const hasGeo = typeof plat === 'number' && typeof plng === 'number';
        const distanceKm = hasGeo ? distKm(location.lat, location.lng, plat, plng) : null;
        return ({
          name: place.name,
          address: place.vicinity,
          type: place.types?.[0] || 'pharmacy',
          latitude: hasGeo ? plat : undefined,
          longitude: hasGeo ? plng : undefined,
          distanceKm: distanceKm != null ? Number(distanceKm.toFixed(2)) : null,
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + place.vicinity)}`
        });
      });
      // Sort nearest to farthest when distance is available
      formattedNearby.sort((a,b) => (
        (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY)
      ));
    }
  } catch (err) {
    console.error("❌ Failed to fetch nearby places:", err.message);
  }
}


    // --- Generate medical advice fields from Gemini ---
    const medicalAdvice = await generateMedicalAdvice(symptoms);

    // --- Compute structured confidence based on symptoms and illness ---
    const computedConfidence = computeConfidence(symptoms || '', medicalAdvice.illness || advice?.illness || '');

    // --- Save consultation ---
    const consultation = await Consultation.create({
      userId,
      inputType,
      symptoms,
      transcript,
      soap,
      advice: {
        ...advice,
        illness: medicalAdvice.illness || 'Unknown',
        confidence: Number.isFinite(Number(medicalAdvice.confidence)) && Number(medicalAdvice.confidence) > 0
          ? Number(medicalAdvice.confidence)
          : computedConfidence,
        homeRemedies: medicalAdvice.homeRemedies || [],
        otcMedicines: medicalAdvice.otcMedicines || [],
        redFlags: medicalAdvice.redFlags || [],
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
