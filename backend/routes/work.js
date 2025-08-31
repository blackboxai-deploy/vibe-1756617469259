const express = require('express');
const { Profile } = require('../models');
const { validateWork, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Get all work experience
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }
    res.json(profile.work);
  } catch (error) {
    console.error('Error fetching work experience:', error);
    res.status(500).json({ error: 'Failed to fetch work experience' });
  }
});

// Add new work experience
router.post('/', sanitizeInput, validateWork, async (req, res) => {
  try {
    const { company, title, duration, description, location, startDate, endDate, current } = req.body;
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    const newWork = {
      company,
      title,
      duration,
      description,
      location: location || '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false
    };

    profile.work.push(newWork);
    await profile.save();

    res.status(201).json({ 
      message: 'Work experience added successfully', 
      work: newWork,
      workList: profile.work
    });
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(500).json({ error: 'Failed to add work experience' });
  }
});

// Update work experience by index
router.put('/:index', sanitizeInput, validateWork, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { company, title, duration, description, location, startDate, endDate, current } = req.body;
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    if (index < 0 || index >= profile.work.length) {
      return res.status(400).json({ error: 'Invalid work experience index' });
    }

    profile.work[index] = {
      company,
      title,
      duration,
      description,
      location: location || '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false
    };

    await profile.save();

    res.json({ 
      message: 'Work experience updated successfully', 
      work: profile.work[index],
      workList: profile.work
    });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(500).json({ error: 'Failed to update work experience' });
  }
});

// Delete work experience by index
router.delete('/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    if (index < 0 || index >= profile.work.length) {
      return res.status(400).json({ error: 'Invalid work experience index' });
    }

    const deletedWork = profile.work.splice(index, 1)[0];
    await profile.save();

    res.json({ 
      message: 'Work experience deleted successfully', 
      deletedWork,
      workList: profile.work
    });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(500).json({ error: 'Failed to delete work experience' });
  }
});

module.exports = router;