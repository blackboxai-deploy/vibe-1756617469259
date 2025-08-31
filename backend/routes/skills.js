const express = require('express');
const { Profile } = require('../models');
const { validateSkill, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }
    res.json(profile.skills.sort());
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Add new skill
router.post('/', sanitizeInput, validateSkill, async (req, res) => {
  try {
    const { skill } = req.body;
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    // Check if skill already exists (case insensitive)
    const existingSkill = profile.skills.find(s => 
      s.toLowerCase() === skill.toLowerCase()
    );

    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists' });
    }

    profile.skills.push(skill);
    await profile.save();

    res.status(201).json({ 
      message: 'Skill added successfully', 
      skill,
      skills: profile.skills.sort()
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Delete skill
router.delete('/:skill', async (req, res) => {
  try {
    const skillToDelete = decodeURIComponent(req.params.skill);
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    const skillIndex = profile.skills.findIndex(s => 
      s.toLowerCase() === skillToDelete.toLowerCase()
    );

    if (skillIndex === -1) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const deletedSkill = profile.skills.splice(skillIndex, 1)[0];
    await profile.save();

    res.json({ 
      message: 'Skill deleted successfully', 
      deletedSkill,
      skills: profile.skills.sort()
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Update skills (bulk update)
router.put('/', sanitizeInput, async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    // Filter out empty skills and remove duplicates
    const cleanSkills = [...new Set(
      skills
        .filter(skill => skill && skill.trim().length >= 2)
        .map(skill => skill.trim())
    )];

    profile.skills = cleanSkills;
    await profile.save();

    res.json({ 
      message: 'Skills updated successfully', 
      skills: profile.skills.sort()
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

module.exports = router;