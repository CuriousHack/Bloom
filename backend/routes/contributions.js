const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const auth = require('../middleware/auth');

// @route   POST /api/contributions
router.post('/', auth, async (req, res) => {
  try {
    const { amount, date, description, cooperativeId } = req.body;

    const newContribution = new Contribution({
      user: req.user.userId,
      cooperative: cooperativeId,
      amount: Number(amount),
      date,
      description,
      // Helper for frontend grouping later
      monthKey: new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })
    });

    const savedContribution = await newContribution.save();
    res.json(savedContribution);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/contributions/:cooperativeId
router.get('/:cooperativeId', auth, async (req, res) => {
  try {
    const contributions = await Contribution.find({ 
      cooperative: req.params.cooperativeId,
      user: req.user.userId 
    }).sort({ date: -1 });
    res.json(contributions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    // Find all contributions where the user is the payer
    const contributions = await Contribution.find({ user: req.user.userId })
      .populate('cooperative', 'name') // Pull group names for the UI
      .sort({ date: -1 });
    res.json(contributions);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;