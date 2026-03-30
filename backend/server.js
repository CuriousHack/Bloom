const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || true; 

app.use(cors({
  // Using 'true' reflects the request origin (same as wildcard but safer)
  origin: allowedOrigin, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/cooperatives', require('./routes/cooperatives'));
app.use('/api/contributions', require('./routes/contributions'));

// Add a simple health check instead (Optional but helpful for Render)
app.get('/api/health', (req, res) => res.json({ status: 'Bloom API is live' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));