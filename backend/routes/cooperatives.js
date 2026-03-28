const express = require('express');
const router = express.Router();
const Cooperative = require('../models/Cooperative');
const auth = require('../middleware/auth');

// @route   POST /api/cooperatives
router.post('/', auth, async (req, res) => {
  try {
    const newCoop = new Cooperative({
      name: req.body.name,
      creator: req.user.userId,
      members: [req.user.userId]
    });
    const savedCoop = await newCoop.save();
    res.json(savedCoop);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/cooperatives (Get all groups user belongs to)
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Cooperative.find({ members: req.user.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;