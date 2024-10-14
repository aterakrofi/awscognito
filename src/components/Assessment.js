// src/components/Assessment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Assessment() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const handleSearch = async () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/openai/generate-questions', {
        topic,
      });
      const data = response.data;

      // Corrected line: data.questions instead of data.choices
      const questions = data.questions;
      setQuestions(questions);
      setCurrentQuestion(0);
      setAnswers([]);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;  // Ensure answer is placed at the correct index
    setAnswers(newAnswers);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleSubmit = async () => {
    if (currentQuestion < questions.length) {
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
      const totalScore = scores.reduce((acc, score) => acc + score.data.score, 0);
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
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Type a topic"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>

      {questions.length > 0 && currentQuestion < questions.length && (
        <div>
          <p>{questions[currentQuestion]}</p>
          <input
            type="text"
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          />
          <button onClick={() => handleAnswer('')}>Next</button>
        </div>
      )}

      {currentQuestion >= questions.length && (
        <button onClick={handleSubmit}>Submit</button>
      )}

      {score > 0 && (
        <p>Your total score is: {score}</p>
      )}
    </div>
  );
}

export default Assessment;
