const express = require('express');
const router = express.Router();
const ThemePreference = require('../models/ThemePreference');

// GET /api/theme — return saved theme
router.get('/', async (req, res) => {
  try {
    let pref = await ThemePreference.findOne({ sessionId: 'global' });
    if (!pref) {
      pref = await ThemePreference.create({ sessionId: 'global', themeName: 'cyberpunk' });
    }
    res.json({ themeName: pref.themeName });
  } catch (err) {
    console.error('GET /api/theme error:', err.message);
    res.status(500).json({ error: 'DB unavailable', themeName: 'cyberpunk' });
  }
});

// POST /api/theme — save selected theme
router.post('/', async (req, res) => {
  const { themeName } = req.body;
  const validThemes = ['cyberpunk', 'matrix', 'dracula', 'nord', 'amber'];

  if (!themeName || !validThemes.includes(themeName)) {
    return res.status(400).json({ error: 'Invalid theme name' });
  }

  try {
    const pref = await ThemePreference.findOneAndUpdate(
      { sessionId: 'global' },
      { themeName, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ themeName: pref.themeName });
  } catch (err) {
    console.error('POST /api/theme error:', err.message);
    res.status(500).json({ error: 'DB unavailable' });
  }
});

module.exports = router;
