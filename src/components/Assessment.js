import React, { useState } from 'react';
import axios from 'axios';

function Assessment() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]); // Store feedback for each question

  const handleSearch = async () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/openai/generate-questions', { topic }); // Generate multiple questions
      const { questions } = response.data;
      setQuestions(questions); // Set all questions
      setAnswers(Array(questions.length).fill('')); // Initialize answers array
      setCurrentQuestionIndex(0);
      setScore(null);
      setFeedback([]);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex] === '') {
      alert('Please provide an answer before proceeding.');
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === '')) {
      alert('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/openai/grade', {
        questions,
        answers,
      });

      const { totalScore, feedback } = response.data;
      setScore(totalScore);
      setFeedback(feedback);
    } catch (error) {
      console.error('Error grading:', error);
      alert('Error grading. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {questions.length > 0 && (
        <div>
          <h3>Question {currentQuestionIndex + 1}:</h3>
          <p>{questions[currentQuestionIndex]}</p>
          <textarea
            value={answers[currentQuestionIndex]}
            onChange={handleAnswerChange}
            placeholder="Type your answer here"
            rows="5"
            style={{ width: '100%', padding: '10px' }}
          />

          {currentQuestionIndex < questions.length - 1 && (
            <button onClick={handleNext} disabled={loading}>
              {loading ? 'Loading...' : 'Next'}
            </button>
          )}

          {currentQuestionIndex === questions.length - 1 && (
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      )}

      {score !== null && (
        <div>
          <h3>Your total score is: {score}</h3>
          {feedback.map((fb, index) => (
            <div key={index}>
              <h4>Question {index + 1} Feedback:</h4>
              <p>{fb}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assessment;
