// ...existing code...
const express = require('express');
const router = express.Router();
const FinancialEntry = require('../models/FinancialEntry');

// Add a new financial entry
router.post('/', async (req, res) => {
  try {
    const entry = new FinancialEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const entries = await FinancialEntry.find({ user: req.params.userId });
    res.json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
// ...existing code...
