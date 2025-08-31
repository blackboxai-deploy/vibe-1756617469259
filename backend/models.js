const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  links: {
    repo: String,
    demo: String,
    live: String
  },
  skills: [String],
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
  startDate: Date,
  endDate: Date
}, { _id: false });

const WorkSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  bio: String,
  education: String,
  skills: [String],
  projects: [ProjectSchema],
  work: [WorkSchema],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
    twitter: String,
    website: String
  },
  preferences: {
    publicProfile: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = { Profile };