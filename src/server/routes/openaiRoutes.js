// src/server/routes/openaiRoutes.js
const express = require('express');
const openaiController = require('../controllers/openaiController');

const router = express.Router();

router.use('/openai', openaiController);

module.exports = router;