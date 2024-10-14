const OpenAI = require('openai');
const express = require('express');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the environment variable for the API key
});

const router = express.Router();

// Generate multiple questions based on the provided topic
const generateQuestions = async (req, res) => {
  const { topic } = req.body; // Get topic from the request body

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4', depending on your access
      messages: [
        {
          role: 'system',
          content: 'You are a useful assistant.',
        },
        {
          role: 'user',
          content: `Generate 5 essay-type knowledge check questions from the topic: ${topic}`,
        },
      ],
    });

    // Ensure the response is mapped correctly to extract the questions
    const questions = completion.choices[0].message.content.trim().split('\n').filter(q => q);

    // Send the questions back to the client
    res.json({ questions });
  } catch (error) {
    // Handle different types of errors (response, request, and others)
    if (error.response) {
      console.error('Error generating questions:', error.response.data);
      res.status(500).json({ error: 'Failed to generate questions', details: error.response.data });
    } else if (error.request) {
      console.error('Error generating questions:', error.request);
      res.status(500).json({ error: 'No response received from OpenAI', details: error.request });
    } else {
      console.error('Error generating questions:', error.message);
      res.status(500).json({ error: 'Unexpected error', details: error.message });
    }
  }
};

// Grade the answers for the questions
const grade = async (req, res) => {
  const { questions, answers } = req.body; // Get questions and answers from the request body

  try {
    const feedback = [];
    let totalScore = 0;

    for (let i = 0; i < questions.length; i++) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a useful assistant that grades user answers and adds feedback.',
          },
          {
            role: 'user',
            content: `Grade the following answer for the question "${questions[i]}": "${answers[i]}"`,
          },
        ],
      });

      // Extract the grading result
      const scoreText = completion.choices[0].message.content.trim();
      let score = parseFloat(scoreText); // You may need to adapt this based on how OpenAI responds

      if (isNaN(score)) {
        // Handle non-numeric grading response
        console.warn('Non-numeric score received:', scoreText);
        feedback.push('Invalid score response: ' + scoreText);
      } else {
        totalScore += score;
        feedback.push(scoreText);
      }
    }

    // Send the total score and feedback back to the client
    res.json({ totalScore, feedback });
  } catch (error) {
    // Handle errors with appropriate logging and responses
    console.error('Error grading:', error);
    res.status(500).json({ error: 'Failed to grade', details: error.message });
  }
};

// Define routes for generating questions and grading
router.post('/generate-questions', generateQuestions); // Updated to plural
router.post('/grade', grade);

module.exports = router;
