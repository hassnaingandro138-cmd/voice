import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VOICES_FILE = path.join(DATA_DIR, 'voices.json');

// Helper to read/write voices
function getStoredVoices(): any[] {
  try {
    if (fs.existsSync(VOICES_FILE)) {
      const data = fs.readFileSync(VOICES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading voices file:', e);
  }
  return [
    {
      id: 'default-villain-1',
      title: 'Bollywood Villain Prank',
      targetName: 'Bhai',
      script: 'bhai to so gaya uth qamene',
      audioData: '',
      voiceSettings: {
        pitch: 0.35,
        speed: 1.0,
        reverb: 0.95,
        bassBoost: 1.4,
        echo: 0.9,
        loop: true,
      },
      createdAt: new Date().toISOString(),
      playsCount: 142,
    }
  ];
}

function saveStoredVoices(voices: any[]) {
  try {
    fs.writeFileSync(VOICES_FILE, JSON.stringify(voices, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving voices file:', e);
  }
}

// Initialize Gemini SDK
const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey ? new GoogleGenAI({
  apiKey: aiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// API Routes
app.get('/api/voices', (req, res) => {
  const voices = getStoredVoices();
  res.json(voices);
});

app.post('/api/voices', (req, res) => {
  try {
    const { title, targetName, script, audioData, voiceSettings } = req.body;
    const voices = getStoredVoices();
    const newVoice = {
      id: 'villain-' + Math.random().toString(36).substring(2, 9),
      title: title || 'Dark Villain Prank',
      targetName: targetName || 'Friend',
      script: script || 'Bhaaiii... tu so gaya kya?',
      audioData: audioData || '',
      voiceSettings: voiceSettings || {
        pitch: 0.5,
        speed: 0.85,
        reverb: 0.9,
        bassBoost: 1.0,
        echo: 0.7,
        loop: true,
      },
      createdAt: new Date().toISOString(),
      playsCount: 0,
    };
    voices.unshift(newVoice);
    saveStoredVoices(voices);
    res.json(newVoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save voice' });
  }
});

app.get('/api/voices/:id', (req, res) => {
  const voices = getStoredVoices();
  const voice = voices.find(v => v.id === req.params.id);
  if (!voice) {
    return res.status(404).json({ error: 'Voice prank not found' });
  }
  // Increment plays count
  voice.playsCount = (voice.playsCount || 0) + 1;
  saveStoredVoices(voices);
  res.json(voice);
});

app.delete('/api/voices/:id', (req, res) => {
  let voices = getStoredVoices();
  const initialLen = voices.length;
  voices = voices.filter(v => v.id !== req.params.id);
  if (voices.length === initialLen) {
    return res.status(404).json({ error: 'Voice not found' });
  }
  saveStoredVoices(voices);
  res.json({ success: true });
});

// AI Script Generator using Gemini (gemini-4-hydrogen)
app.post('/api/ai/script', async (req, res) => {
  try {
    const { prompt, targetName } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key not configured on server.' });
    }

    const systemInstruction = `You are a terrifying Indian Bollywood movie villain scriptwriter. Generate dark, heavy, menacing, and scary villain voiceover dialogue in Urdu, Roman Urdu, or Hindi (such as 'بھائی... tu so gaya kya?'). The target of this prank is named ${targetName || 'Friend'}. Make it suspenseful, deep, dramatic, and intimidating, perfect for an authentic Bollywood villain prank.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt || `Write a scary villain prank script for ${targetName || 'Friend'}.`,
      config: {
        systemInstruction,
      },
    });

    res.json({ script: response.text || 'Bhaaiii... tu so gaya kya? The dark is watching you.' });
  } catch (error: any) {
    console.error('AI Script error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI script' });
  }
});

// Audio Transcription using gemini-3.5-transcribe
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key not configured on server.' });
    }
    if (!audioData) {
      return res.status(400).json({ error: 'No audio data provided.' });
    }

    // audioData is base64 string (either with data url prefix or raw)
    let cleanBase64 = audioData;
    let detectedMime = mimeType || 'audio/mp3';
    if (audioData.includes('base64,')) {
      const parts = audioData.split('base64,');
      cleanBase64 = parts[1];
      const match = audioData.match(/^data:(.*?);base64/);
      if (match && match[1]) {
        detectedMime = match[1];
      }
    }

    const audioPart = {
      inlineData: {
        mimeType: detectedMime,
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: [audioPart, 'Transcribe this audio recording accurately word for word.'],
    });

    res.json({ transcript: response.text || 'Transcription completed.' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Setup Vite middleware in dev, static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
