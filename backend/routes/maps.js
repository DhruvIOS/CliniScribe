const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // npm install node-fetch@2

router.post('/nearby', async (req, res) => {
  let lat, lng;
  if (req.body.location) {
    lat = req.body.location.lat;
    lng = req.body.location.lng;
  } else {
    lat = req.body.lat;
    lng = req.body.lng;
  }

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing location' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.types,places.googleMapsUri'
  };
  const body = JSON.stringify({
    includedTypes: ['hospital', 'pharmacy'],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng
        },
        radius: 3000
      }
    }
  });

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      return res.status(500).json({ error: 'Failed to fetch nearby places', details: errorData });
    }

    const data = await resp.json();
    const results = (data.places || []).map(place => ({
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || 'No address',
      type: place.types ? place.types.join(', ') : 'unknown',
      mapsUrl: place.googleMapsUri || ''
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch nearby places', details: err.message });
  }
});

module.exports = router;