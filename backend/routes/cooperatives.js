const express = require('express');
const router = express.Router();
const Cooperative = require('../models/Cooperative');
const auth = require('../middleware/auth');
const Contribution = require('../models/Contribution');

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
    const groups = await Cooperative.find({ members: req.user.userId }).lean();

    // Fetch balances for each group
    const groupsWithBalance = await Promise.all(groups.map(async (group) => {
      const contributions = await Contribution.find({ cooperative: group._id, user: req.user.userId });
      const balance = contributions.reduce((acc, curr) => acc + curr.amount, 0);
      return { ...group, balance }; // Add the calculated balance to the object
    }));

    res.json(groupsWithBalance);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;