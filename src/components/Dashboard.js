// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import userpool from '../userpool';

function Dashboard() {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.signOut();
      navigate('/');
    }
  };

  return (
    <div>
      <button onClick={handleStartAssessment}>Start Assessment</button>
      <button onClick={handleSettings}>Settings</button>
      <button onClick={handleLogout}>Logout</button>
      <h1>Dashboard</h1>
      <p>User Progress: {/* Display user progress */}</p>
      <p>Scores: {/* Display user scores */}</p>
      <p>Past Assessments: {/* Display past assessments */}</p>
      <p>Future Assessments Configurations: {/* Display configurations for future assessments */}</p>
      
    </div>
  );
}

export default Dashboard;
