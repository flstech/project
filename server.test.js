const request = require('supertest');
const express = require('express');

const app = express();
const port = 4004;

// /api/health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /api/mirror endpoint
app.get('/api/mirror', (req, res) => {
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

  res.json({ transformed: transformed });
});

describe("API Endpoints", function() {
  it("should return the health status", async function() {
    const res = await request(app).get('/api/health');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it("should transform the word correctly", async function() {
    const word = 'fOoBar25';
    const expectedTransformed = '52RAbOoF';
    const res = await request(app).get(`/api/mirror?word=${word}`);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ transformed: expectedTransformed });
  });

  it("should return 400 if the word query parameter is missing", async function() {
    const res = await request(app).get('/api/mirror');
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: 'word query parameter is required' });
  });
});
