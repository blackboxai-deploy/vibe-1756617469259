const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/projects');
const workRoutes = require('./routes/work');
const skillRoutes = require('./routes/skills');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/profile', profileRoutes);
app.use('/projects', projectRoutes);
app.use('/work', workRoutes);
app.use('/skills', skillRoutes);

// Legacy routes for backward compatibility
app.get('/profile', profileRoutes);
app.post('/profile', profileRoutes);

// Search endpoint (legacy compatibility)
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const { Profile } = require('./models');
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ error: 'No profile found' });

    const results = profile.projects.filter(
      p => p.title.toLowerCase().includes(q.toLowerCase()) ||
           p.description.toLowerCase().includes(q.toLowerCase())
    );
    res.json(results);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Skills top endpoint (legacy compatibility)
app.get('/skills/top', async (req, res) => {
  try {
    const { Profile } = require('./models');
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ error: 'No profile found' });
    res.json(profile.skills.sort());
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});