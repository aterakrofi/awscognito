// src/components/Settings.js
import React, { useState } from 'react';

function Settings() {
  const [passScore, setPassScore] = useState(50);
  const [numQuestions, setNumQuestions] = useState(10);

  return (
    <div>
      <h1>Settings</h1>
      <label>
        Pass Score:
        <input 
          type="number" 
          value={passScore} 
          onChange={(e) => setPassScore(e.target.value)} 
        />
      </label>
      <label>
        Number of Questions:
        <input 
          type="number" 
          value={numQuestions} 
          onChange={(e) => setNumQuestions(e.target.value)} 
        />
      </label>
    </div>
  );
}

export default Settings;
