// src/components/Assessment.js
import React, { useState } from 'react';
import axios from 'axios';

function Assessment() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const handleSearch = async () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/openai/generate-questions', { topic });
      const { questions } = response.data;
      setQuestions(questions);
      setCurrentQuestion(0);
      setAnswers(Array(questions.length).fill(''));  // Initialize answers array
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === '')) {
      alert('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    try {
      const scores = await Promise.all(questions.map((question, index) => {
        return axios.post('/api/openai/grade', {
          question,
          answer: answers[index],
        });
      }));
      
      const totalScore = scores.reduce((acc, score) => acc + parseFloat(score.data.score || 0), 0);
      setScore(totalScore);
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

      {/* Questions and Answer Input */}
      {questions.length > 0 && (
        <div>
          <h3>Question {currentQuestion + 1}:</h3>
          <p>{questions[currentQuestion]}</p>
          <textarea
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
            placeholder="Type your answer here"
            rows="5"
            style={{ width: '100%', padding: '10px' }}
          />
          
          {/* Next Button for Non-final Questions */}
          {currentQuestion < questions.length - 1 && (
            <button onClick={handleNext}>
              Next
            </button>
          )}

          {/* Submit Button for Final Question */}
          {currentQuestion === questions.length - 1 && (
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
