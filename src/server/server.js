// src/server/server.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openaiRoutes');

console.log(process.env.OPENAI_API_KEY);
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for requests from the React app

// Use OpenAI routes
app.use('/api', openaiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});