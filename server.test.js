const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');

// Define a schema and model for storing the word pairs
const wordSchema = new mongoose.Schema({
  original: String,
  transformed: String
});
const Word = mongoose.model('Word', wordSchema);

const app = express();
const port = 4004;

// Connect to MongoDB
beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/mirrorDB_test'; // Use a different DB for testing
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
  await Word.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

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

describe("API Endpoints", function() {
  it("should return the health status", async function() {
    const res = await request(app).get('/api/health');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it("should transform the word correctly and save to the database", async function() {
    const word = 'fOoBar25';
    const expectedTransformed = '52RAbOoF';
    const res = await request(app).get(`/api/mirror?word=${word}`);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ transformed: expectedTransformed });

    // Check if the word pair is saved in the database
    const savedWordPair = await Word.findOne({ original: word });
    expect(savedWordPair).not.toBeNull();
    expect(savedWordPair.transformed).toEqual(expectedTransformed);
  });

  it("should return 400 if the word query parameter is missing", async function() {
    const res = await request(app).get('/api/mirror');
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: 'word query parameter is required' });
  });
});
