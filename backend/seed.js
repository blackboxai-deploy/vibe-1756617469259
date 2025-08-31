const mongoose = require('mongoose');
const { Profile } = require('./models');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Profile.deleteMany({});
    console.log('Cleared existing profile data');

    // Create comprehensive profile data
    const profile = new Profile({
      name: 'Arsh Gupta',
      email: 'arshg0080@gmail.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Passionate full-stack developer with expertise in modern web technologies. Love building scalable applications and learning new technologies.',
      education: 'BTech in Information Technology from Delhi Technological University',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'Python', 'SQL', 'Git', 'AWS'],
      projects: [
        {
          title: 'Me-API Playground',
          description: 'A comprehensive profile management system with CRUD operations for managing personal portfolio, projects, and work experience. Features include real-time updates, search functionality, and responsive design.',
          skills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'React'],
          status: 'completed',
          links: { 
            repo: 'https://github.com/Arsh0080/Intern_Project',
            demo: 'https://me-api-playground.vercel.app'
          },
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-15')
        },
        {
          title: 'E-commerce Platform',
          description: 'Full-featured e-commerce platform with user authentication, product catalog, shopping cart, payment integration, and order management system.',
          skills: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT'],
          status: 'completed',
          links: { 
            repo: 'https://github.com/Arsh0080/ecommerce-platform',
            demo: 'https://ecommerce-demo.vercel.app'
          },
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-20')
        },
        {
          title: 'Task Management App',
          description: 'Collaborative task management application with real-time updates, team collaboration features, file sharing, and progress tracking.',
          skills: ['TypeScript', 'React', 'Socket.io', 'PostgreSQL'],
          status: 'in-progress',
          links: { 
            repo: 'https://github.com/Arsh0080/task-manager'
          },
          startDate: new Date('2024-03-01')
        }
      ],
      work: [
        {
          company: 'TechStart Solutions',
          title: 'Full Stack Developer',
          duration: 'Jan 2023 - Present',
          description: 'Developing and maintaining web applications using React, Node.js, and MongoDB. Led a team of 3 developers in building a customer management system that improved client satisfaction by 40%.',
          location: 'San Francisco, CA',
          current: true,
          startDate: new Date('2023-01-15')
        },
        {
          company: 'InnovateTech',
          title: 'Frontend Developer Intern',
          duration: 'Jun 2022 - Dec 2022',
          description: 'Worked on user interface development using React and TypeScript. Implemented responsive designs and improved website performance by 25% through code optimization.',
          location: 'Remote',
          current: false,
          startDate: new Date('2022-06-01'),
          endDate: new Date('2022-12-31')
        },
        {
          company: 'StartupXYZ',
          title: 'Junior Developer',
          duration: 'Jan 2022 - May 2022',
          description: 'Contributed to backend development using Node.js and Express. Implemented REST APIs and worked on database optimization resulting in 30% faster query performance.',
          location: 'New York, NY',
          current: false,
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-05-31')
        }
      ],
      links: {
        github: 'https://github.com/Arsh0080',
        linkedin: 'https://linkedin.com/in/arshgupta',
        portfolio: 'https://arshgupta.dev',
        twitter: 'https://twitter.com/arshgupta_dev',
        website: 'https://arshgupta.com'
      },
      preferences: {
        publicProfile: true,
        showEmail: true,
        showPhone: false
      }
    });

    await profile.save();
    console.log("Database seeded successfully with comprehensive profile data");
    console.log(`Profile created: ${profile.name}`);
    console.log(`Projects: ${profile.projects.length}`);
    console.log(`Work Experience: ${profile.work.length}`);
    console.log(`Skills: ${profile.skills.length}`);
    
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

seed();