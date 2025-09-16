const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio provided' });
    }

    // Use Blob for OpenAI SDK v5+ (Node 18+)
    const { Blob } = require('buffer');
    const audioBlob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });

    const result = await client.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
      // language: 'en', // optionally pin language
    });

    res.json({ text: result?.text || '' });
  } catch (e) {
    console.error('[stt] transcription failed:', e?.message || e);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;

