const express = require('express'); // Import the express library to create a web server
const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

const app = express(); // Create an express application
const port = 4004; // Define the port number where the server will listen

// Connect to the MongoDB database named mirrorDB
mongoose.connect('mongodb://localhost:27017/mirrorDB')
  .then(() => console.log('MongoDB connected')) // Log a success message if connected
  .catch(err => console.error('MongoDB connection error:', err)); // Log an error message if connection fails

// Define the schema for storing word pairs (original and transformed words)
const wordSchema = new mongoose.Schema({
  original: String, // Original word
  transformed: String // Transformed word (reversed and case-swapped)
});
const Word = mongoose.model('Word', wordSchema); // Create a model based on the schema

// Endpoint to check the health of the server
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' }); // Respond with a JSON object indicating the server is healthy
});

// Endpoint to transform and store a word
app.get('/api/mirror', async (req, res) => {
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

  try {
    // Save the original and transformed words to the database
    const newWordPair = new Word({ original: word, transformed: transformed });
    await newWordPair.save(); // Save the word pair to the database

    res.json({ transformed: transformed }); // Respond with the transformed word
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the word pair to the database' }); // Handle errors during save
  }
});

// Start the server and listen for requests on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log a message indicating the server is running
});
