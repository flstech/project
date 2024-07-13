const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4004;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mirrorDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for storing the word pairs
const wordSchema = new mongoose.Schema({
  original: String,
  transformed: String
});
const Word = mongoose.model('Word', wordSchema);

// /api/health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /api/mirror endpoint
app.get('/api/mirror', async (req, res) => {
  const word = req.query.word;
  if (!word) {
    return res.status(400).json({ error: 'word query parameter is required' });
  }

  // Transform the word
  const transformed = word
    .split('')
    .map(char => {
      if (char === char.toLowerCase()) {
        return char.toUpperCase();
      } else if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char;
      }
    })
    .reverse()
    .join('');

  try {
    // Save the pair to the database
    const newWordPair = new Word({ original: word, transformed: transformed });
    await newWordPair.save();

    res.json({ transformed: transformed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the word pair to the database' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
