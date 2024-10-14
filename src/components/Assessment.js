import React, { useState } from 'react';
import axios from 'axios';

function Assessment() {
  const [topic, setTopic] = useState(''); // Topic input
  const [question, setQuestion] = useState(''); // Current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [answers, setAnswers] = useState([]); // Store answers
  const [loading, setLoading] = useState(false); // Loading state
  const [score, setScore] = useState(null); // Score state

  // Function to generate a new question
  const handleSearch = async () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/openai/generate-question', { topic }); // Generate one question
      const { question } = response.data;
      setQuestion(question); // Set the current question
      setAnswers([]); // Reset answers
      setCurrentQuestionIndex(0); // Reset index
      setScore(null); // Reset score
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Error generating question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle answer changes
  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value; // Store answer for the current question
    setAnswers(newAnswers);
  };

  // Function to handle next question
  const handleNext = async () => {
    // Ensure the answer for the current question is saved
    if (answers[currentQuestionIndex] === undefined) {
      alert('Please provide an answer before proceeding.');
      return;
    }

    setLoading(true);
    try {
      // Fetch the next question
      const response = await axios.post('/api/openai/generate-question', { topic });
      const { question } = response.data;
      
      // Move to the next question
      setQuestion(question); 
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Increment question index
    } catch (error) {
      console.error('Error fetching next question:', error);
      alert('Error fetching next question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle final submission
  const handleSubmit = async () => {
    if (answers.some(answer => answer === undefined || answer === '')) {
      alert('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    try {
      // Grade the answer for the current question
      const response = await axios.post('/api/openai/grade', {
        question,
        answer: answers[currentQuestionIndex], // Only send the current answer
      });

      const totalScore = response.data.score || 0; // Get score from response
      setScore(totalScore); // Set total score
    } catch (error) {
      console.error('Error grading:', error);
      alert('Error grading. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Topic Search */}
      <div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {/* Current Question and Answer Input */}
      {question && (
        <div>
          <h3>Question {currentQuestionIndex + 1}:</h3>
          <p>{question}</p>
          <textarea
            value={answers[currentQuestionIndex] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here"
            rows="5"
            style={{ width: '100%', padding: '10px' }}
          />

          {/* Next Button for Non-final Questions */}
          <button onClick={handleNext} disabled={loading}>
            {loading ? 'Loading...' : 'Next'}
          </button>

          {/* Submit Button for Final Question */}
          {currentQuestionIndex === 4 && ( // Assuming there are 5 questions in total
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      )}

      {/* Show Score after submission */}
      {score !== null && (
        <div>
          <h3>Your total score is: {score}</h3>
        </div>
      )}
    </div>
  );
}

export default Assessment;
