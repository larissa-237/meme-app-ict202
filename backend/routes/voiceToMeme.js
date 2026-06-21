const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Fichier audio manquant' });
  }

  try {
    const audioData = fs.readFileSync(req.file.path);
    const base64Audio = audioData.toString('base64');

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un générateur de memes. On va te donner une transcription audio. Génère une légende de meme courte et drôle en français.'
          },
          {
            role: 'user',
            content: 'Transcription: ' + (req.body.transcription || 'message vocal')
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

    fs.unlinkSync(req.file.path);

    const meme = response.data.choices[0].message.content;
    res.json({ meme, transcription: req.body.transcription || '' });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur API IA' });
  }
});

module.exports = router;