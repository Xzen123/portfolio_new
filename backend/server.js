const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const themeRoutes = require('./routes/theme');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://xzen-alok.tech' }));
app.use(express.json());

// Routes
app.use('/api/theme', themeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API running' });
});

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB not available, theme will use localStorage fallback');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
