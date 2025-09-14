// routes/video.js
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { findYouTubeVideo } = require('../services/geminiVeo');
const VideoGenerationService = require('../services/videoGeneration');

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

// Veo 3 Video Generation Routes

/**
 * POST /api/video/generate
 * Start video generation for a health consultation using Veo 3
 */
router.post('/generate', async (req, res) => {
  try {
    const consultationData = req.body;

    if (!consultationData) {
      return res.status(400).json({ error: 'Consultation data is required' });
    }

    console.log('🎬 Veo 3 video generation request received');

    const result = await VideoGenerationService.generateHealthVideo(consultationData);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Error in Veo 3 video generation:', error);
    res.status(500).json({
      error: 'Failed to start video generation',
      details: error.message
    });
  }
});

/**
 * GET /api/video/status/:operationId
 * Check video generation status
 */
router.get('/status/:operationId', async (req, res) => {
  try {
    const { operationId } = req.params;

    if (!operationId) {
      return res.status(400).json({ error: 'Operation ID is required' });
    }

    const status = await VideoGenerationService.pollVideoStatus(operationId);

    res.json({
      success: true,
      ...status
    });

  } catch (error) {
    console.error('❌ Error checking video status:', error);
    res.status(500).json({
      error: 'Failed to check video status',
      details: error.message
    });
  }
});

/**
 * GET /api/video/download/:operationId
 * Get download URL for generated video
 */
router.get('/download/:operationId', async (req, res) => {
  try {
    const { operationId } = req.params;

    if (!operationId) {
      return res.status(400).json({ error: 'Operation ID is required' });
    }

    const downloadInfo = await VideoGenerationService.getVideoDownloadUrl(operationId);

    res.json({
      success: true,
      ...downloadInfo
    });

  } catch (error) {
    console.error('❌ Error getting video download:', error);
    res.status(500).json({
      error: 'Failed to get video download URL',
      details: error.message
    });
  }
});

/**
 * DELETE /api/video/cleanup/:operationId
 * Clean up video generation operation
 */
router.delete('/cleanup/:operationId', async (req, res) => {
  try {
    const { operationId } = req.params;

    if (!operationId) {
      return res.status(400).json({ error: 'Operation ID is required' });
    }

    const cleaned = VideoGenerationService.cleanupOperation(operationId);

    res.json({
      success: true,
      cleaned,
      message: cleaned ? 'Operation cleaned up successfully' : 'Operation not found'
    });

  } catch (error) {
    console.error('❌ Error cleaning up operation:', error);
    res.status(500).json({
      error: 'Failed to cleanup operation',
      details: error.message
    });
  }
});

module.exports = router;
