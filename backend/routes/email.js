const express = require('express');
const router = express.Router();

let transporter = null;
try {
  // Lazy require to avoid crash if not installed during dev
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
} catch (e) {
  console.warn('[email] nodemailer not installed; email route will no-op');
}

router.post('/send', async (req, res) => {
  const { to, subject, html } = req.body || {};
  if (!to || !html) return res.status(400).json({ error: 'Missing to/html' });

  if (!transporter) {
    console.warn('[email] transporter unavailable; simulating success');
    return res.json({ ok: true, simulated: true });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@cliniscribe.app',
      to,
      subject: subject || 'Cliniscribe Follow-up',
      html,
    });
    res.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    console.error('[email] send failed:', e);
    res.status(500).json({ error: 'Email send failed' });
  }
});

module.exports = router;

