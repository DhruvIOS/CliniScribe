const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const history = await Consultation.find({ userId }).sort({ createdAt: -1 });
  res.json({ history });
});

router.get('/entry/:id', async (req, res) => {
  const { id } = req.params;
  const entry = await Consultation.findById(id);
  res.json({ entry });
});

module.exports = router;