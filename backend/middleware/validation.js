const validateProfile = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }
  
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  next();
};

const validateProject = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Project title must be at least 3 characters long' });
  }
  
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'Project description must be at least 10 characters long' });
  }
  
  next();
};

const validateWork = (req, res, next) => {
  const { company, title, duration, description } = req.body;
  
  if (!company || company.trim().length < 2) {
    return res.status(400).json({ error: 'Company name must be at least 2 characters long' });
  }
  
  if (!title || title.trim().length < 2) {
    return res.status(400).json({ error: 'Job title must be at least 2 characters long' });
  }
  
  if (!duration || duration.trim().length < 3) {
    return res.status(400).json({ error: 'Duration is required' });
  }
  
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'Job description must be at least 10 characters long' });
  }
  
  next();
};

const validateSkill = (req, res, next) => {
  const { skill } = req.body;
  
  if (!skill || skill.trim().length < 2) {
    return res.status(400).json({ error: 'Skill must be at least 2 characters long' });
  }
  
  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
};

module.exports = {
  validateProfile,
  validateProject,
  validateWork,
  validateSkill,
  sanitizeInput
};