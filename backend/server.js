const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { generateTwoSumSteps, generateSlidingWindowSteps } = require('./utils/stepGenerator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const problemsPath = path.join(__dirname, 'data', 'problems.json');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoscope')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const progressRoutes = require('./routes/progress');
app.use('/api/progress', progressRoutes);

app.get('/api/problems', (req, res) => {
  fs.readFile(problemsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read problems data' });
    }
    const problems = JSON.parse(data);
    // Strip heavy steps data for list view
    const metadata = problems.map(({ brute_force_steps, optimal_steps, ...rest }) => rest);
    res.json(metadata);
  });
});

app.get('/api/problems/:slug', (req, res) => {
  const slugOrId = req.params.slug;
  fs.readFile(problemsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read problems data' });
    }
    const problems = JSON.parse(data);
    const problem = problems.find(p => p.slug === slugOrId || p.id === parseInt(slugOrId));
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  });
});

app.post('/api/problems/:id/steps', (req, res) => {
  const id = parseInt(req.params.id);
  const { input, target } = req.body;

  try {
    if (id === 1) {
      const nums = JSON.parse(input);
      const targetVal = parseInt(target);
      const { bruteForceSteps, optimalSteps } = generateTwoSumSteps(nums, targetVal);
      return res.json({ bruteForceSteps, optimalSteps });
    }

    if (id === 3) {
      // Input for Problem 3 is a string
      const s = typeof input === 'string' ? input : JSON.stringify(input).replace(/^"|"$/g, '');
      const { bruteForceSteps, optimalSteps } = generateSlidingWindowSteps(s, target);
      return res.json({ bruteForceSteps, optimalSteps });
    }

    res.status(501).json({ error: 'Dynamic steps not yet implemented for this problem.' });
  } catch (e) {
    res.status(400).json({ error: 'Invalid input format.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
