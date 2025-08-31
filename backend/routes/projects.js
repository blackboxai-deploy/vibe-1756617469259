const express = require('express');
const { Profile } = require('../models');
const { validateProject, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { skill } = req.query;
    const profile = await Profile.findOne({});
    
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    let projects = profile.projects;
    
    if (skill) {
      projects = projects.filter(p => 
        p.skills && p.skills.some(s => 
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Add new project
router.post('/', sanitizeInput, validateProject, async (req, res) => {
  try {
    const { title, description, links, skills, status, startDate, endDate } = req.body;
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    const newProject = {
      title,
      description,
      links: links || {},
      skills: skills || [],
      status: status || 'completed',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    profile.projects.push(newProject);
    await profile.save();

    res.status(201).json({ 
      message: 'Project added successfully', 
      project: newProject,
      projects: profile.projects
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Update project by index
router.put('/:index', sanitizeInput, validateProject, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { title, description, links, skills, status, startDate, endDate } = req.body;
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    if (index < 0 || index >= profile.projects.length) {
      return res.status(400).json({ error: 'Invalid project index' });
    }

    profile.projects[index] = {
      title,
      description,
      links: links || {},
      skills: skills || [],
      status: status || 'completed',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    await profile.save();

    res.json({ 
      message: 'Project updated successfully', 
      project: profile.projects[index],
      projects: profile.projects
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project by index
router.delete('/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    const profile = await Profile.findOne({});
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }

    if (index < 0 || index >= profile.projects.length) {
      return res.status(400).json({ error: 'Invalid project index' });
    }

    const deletedProject = profile.projects.splice(index, 1)[0];
    await profile.save();

    res.json({ 
      message: 'Project deleted successfully', 
      deletedProject,
      projects: profile.projects
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;