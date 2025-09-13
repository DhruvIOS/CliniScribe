const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Accept: {user: {googleId, name, email, photo}}
router.post('/google', async (req, res) => {
  const { user } = req.body;
  if (!user || !user.googleId) return res.status(400).json({ error: 'Missing user info' });
  let dbUser = await User.findOne({ googleId: user.googleId });
  if (!dbUser) dbUser = await User.create(user);
  res.json({ user: dbUser });
});

module.exports = router;