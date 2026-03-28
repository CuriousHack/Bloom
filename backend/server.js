const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// API Routes (To be created)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/payments', require('./routes/payments'));
app.use('/api/auth', authRoutes);
app.use('/api/cooperatives', require('./routes/cooperatives'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));