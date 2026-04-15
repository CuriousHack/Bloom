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

// @route   PUT /api/contributions/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, description, date } = req.body;
    let contribution = await Contribution.findById(req.params.id);

    if (!contribution) return res.status(404).json({ message: "Payment not found" });
    if (contribution.user.toString() !== req.user.userId) return res.status(401).json({ message: "Unauthorized" });

    // Update fields
    if (amount) contribution.amount = amount;
    if (description) contribution.description = description;
    if (date) contribution.date = date;

    await contribution.save();
    res.json(contribution);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;