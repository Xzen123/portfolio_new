const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/verify', async (req, res) => {
  const transporter = createTransporter();

  if (!transporter) {
    return res.status(400).json({
      ok: false,
      message: 'SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.',
    });
  }

  try {
    await transporter.verify();
    return res.json({ ok: true, message: 'SMTP connection verified successfully.' });
  } catch (err) {
    return res.status(500).json({ ok: false, message: `SMTP verification failed: ${err.message}` });
  }
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const transporter = createTransporter();
  if (!transporter) {
    return res.status(500).json({
      error: 'Email service is not configured. Set SMTP variables in backend .env.',
    });
  }

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'alokcse03@gmail.com';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: receiver,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: [
        'New contact form submission',
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'We received your message',
      text: [
        `Hi ${name},`,
        '',
        'Thanks for reaching out. Your message was received successfully.',
        'I will get back to you as soon as possible.',
        '',
        'Regards,',
        'Alok Kumar Chaudhary',
      ].join('\n'),
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. Your message was received successfully.</p>
        <p>I will get back to you as soon as possible.</p>
        <p>Regards,<br/>Alok Kumar Chaudhary</p>
      `,
    });

    return res.json({ ok: true, message: 'Message sent and auto-reply delivered.' });
  } catch (err) {
    return res.status(500).json({ error: `Email sending failed: ${err.message}` });
  }
});

module.exports = router;
