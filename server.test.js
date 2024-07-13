const request = require('supertest'); // Import supertest for HTTP assertions
const express = require('express'); // Import express to create a web server

const app = express(); // Create an express application
const port = 4004; // Define the port number where the server will listen

// Endpoint to check the health of the server
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' }); // Respond with a JSON object indicating the server is healthy
});

// Endpoint to transform a word and return the transformed word
app.get('/api/mirror', (req, res) => {
  const word = req.query.word; // Get the word from the query parameters
  if (!word) {
    return res.status(400).json({ error: 'word query parameter is required' }); // Return an error if no word is provided
  }

  // Transform the word by reversing and swapping the case of each character
  const transformed = word
    .split('') // Split the word into individual characters
    .map(char => {
      if (char === char.toLowerCase()) {
        return char.toUpperCase(); // Convert lowercase letters to uppercase
      } else if (char === char.toUpperCase()) {
        return char.toLowerCase(); // Convert uppercase letters to lowercase
      } else {
        return char; // Leave non-letter characters unchanged
      }
    })
    .reverse() // Reverse the order of the characters
    .join(''); // Join the characters back into a string

  res.json({ transformed: transformed }); // Respond with the transformed word
});

// Tests for the API endpoints
describe("API Endpoints", function() {
  // Test the /api/health endpoint
  it("should return the health status", async function() {
    const res = await request(app).get('/api/health'); // Send a GET request to /api/health
    expect(res.status).toEqual(200); // Expect the response status to be 200 (OK)
    expect(res.body).toEqual({ status: 'ok' }); // Expect the response body to contain { status: 'ok' }
  });

  // Test the /api/mirror endpoint with a word
  it("should transform the word correctly", async function() {
    const word = 'fOoBar25'; // Define the word to be transformed
    const expectedTransformed = '52RAbOoF'; // Define the expected transformed word
    const res = await request(app).get(`/api/mirror?word=${word}`); // Send a GET request to /api/mirror with the word
    expect(res.status).toEqual(200); // Expect the response status to be 200 (OK)
    expect(res.body).toEqual({ transformed: expectedTransformed }); // Expect the response body to contain the transformed word
  });

  // Test the /api/mirror endpoint without a word
  it("should return 400 if the word query parameter is missing", async function() {
    const res = await request(app).get('/api/mirror'); // Send a GET request to /api/mirror without a word
    expect(res.status).toEqual(400); // Expect the response status to be 400 (Bad Request)
    expect(res.body).toEqual({ error: 'word query parameter is required' }); // Expect the response body to contain an error message
  });
});
