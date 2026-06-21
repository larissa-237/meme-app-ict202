const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Texte vide' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "Tu es un générateur de memes. Analyse le texte et génère une légende courte et drôle en français. Réponds uniquement avec la légende."
          },
          {
            role: 'user',
            content: text
          }
        ]
      },
      {
        headers: {
          Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const memeText = response.data.choices[0].message.content;
    res.json({ meme: memeText });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur API IA' });
  }
});

module.exports = router;