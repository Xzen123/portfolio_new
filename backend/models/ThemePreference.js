const mongoose = require('mongoose');

const themePreferenceSchema = new mongoose.Schema({
  sessionId: { type: String, default: 'global' },
  themeName: {
    type: String,
    enum: ['cyberpunk', 'matrix', 'dracula', 'nord', 'amber'],
    default: 'cyberpunk',
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ThemePreference', themePreferenceSchema);
