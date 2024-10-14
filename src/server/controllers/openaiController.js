// src/server/controllers/openaiController.js
const OpenAI = require('openai');
const express = require('express');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the environment variable for the API key
});

const router = express.Router();

// Generate a single question based on the provided topic
const generateQuestion = async (req, res) => {
  const { topic } = req.body; // Get topic from the request body

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4', depending on your access
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `Generate an essay-type question from the topic: ${topic}`,
        },
      ],
    });

    // Ensure the response is mapped correctly to extract the question
    const question = completion.choices[0].message.content.trim();
    
    // Send the question back to the client
    res.json({ question });
  } catch (error) {
    // Handle different types of errors (response, request, and others)
    if (error.response) {
      console.error('Error generating question:', error.response.data);
      res.status(500).json({ error: 'Failed to generate question', details: error.response.data });
    } else if (error.request) {
      console.error('Error generating question:', error.request);
      res.status(500).json({ error: 'No response received from OpenAI', details: error.request });
    } else {
      console.error('Error generating question:', error.message);
      res.status(500).json({ error: 'Unexpected error', details: error.message });
    }
  }
};

// Grade the answer for a specific question
const grade = async (req, res) => {
  const { question, answer } = req.body; // Get question and answer from the request body

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that grades answers.',
        },
        {
          role: 'user',
          content: `Grade the following answer for the question "${question}": "${answer}"`,
        },
      ],
    });

    // Extract the grading result
    const scoreText = completion.choices[0].message.content.trim();
    
    // Parse score, assuming it's a numeric value or scale provided by OpenAI
    let score = parseFloat(scoreText); // You may need to adapt this based on how OpenAI responds

    if (isNaN(score)) {
      // Handle non-numeric grading response
      console.warn('Non-numeric score received:', scoreText);
      res.json({ score: 'Invalid score response: ' + scoreText });
    } else {
      // Send the numeric score back to the client
      res.json({ score });
    }
  } catch (error) {
    // Handle errors with appropriate logging and responses
    console.error('Error grading:', error);
    res.status(500).json({ error: 'Failed to grade', details: error.message });
  }
};

// Define routes for generating questions and grading
router.post('/generate-question', generateQuestion); // Updated to singular
router.post('/grade', grade);

module.exports = router;
