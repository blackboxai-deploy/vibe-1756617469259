const express = require('express');
const { Profile } = require('../models');
const { validateProfile, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Get profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update profile
router.post('/', sanitizeInput, validateProfile, async (req, res) => {
  try {
    const { name, email, phone, location, bio, education, links, preferences } = req.body;
    
    let profile = await Profile.findOne({});
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, { 
        name, 
        email, 
        phone, 
        location, 
        bio, 
        education, 
        links: { ...profile.links, ...links },
        preferences: { ...profile.preferences, ...preferences }
      });
      await profile.save();
      res.json({ message: 'Profile updated successfully', profile });
    } else {
      // Create new profile
      profile = new Profile({ 
        name, 
        email, 
        phone, 
        location, 
        bio, 
        education, 
        links: links || {}, 
        preferences: preferences || {},
        skills: [],
        projects: [],
        work: []
      });
      await profile.save();
      res.status(201).json({ message: 'Profile created successfully', profile });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Delete profile
router.delete('/', async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router;