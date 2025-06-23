const express = require('express');
const router = express.Router();
const { askLlama } = require('../utils/llama');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const reply = await askLlama(message);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'LLaMA failed to respond' });
  }
});

module.exports = router; 