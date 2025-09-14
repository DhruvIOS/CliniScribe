const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Consultation.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({ error: 'Failed to fetch consultation history' });
  }
});

router.get('/entry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Consultation.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    res.json(entry);
  } catch (error) {
    console.error('Error fetching consultation entry:', error);
    res.status(500).json({ error: 'Failed to fetch consultation entry' });
  }
});

// Update recovery status
router.put('/recovery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isResolved, recoveryNotes, followUpRequired } = req.body;

    const updateData = {
      'recovery.isResolved': isResolved,
      'recovery.followUpRequired': followUpRequired || false,
    };

    if (isResolved !== null) {
      updateData['recovery.resolvedAt'] = new Date();
    }

    if (recoveryNotes) {
      updateData['recovery.recoveryNotes'] = recoveryNotes;
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.json(consultation);
  } catch (error) {
    console.error('Error updating recovery status:', error);
    res.status(500).json({ error: 'Failed to update recovery status' });
  }
});

module.exports = router;