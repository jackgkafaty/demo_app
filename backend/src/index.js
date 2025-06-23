require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const { filterPII } = require('./middleware/filterPII');
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const backupRoutes = require('./routes/backup');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// OpenAI setup
let openai = null;
if (process.env.OPENAI_KEY && process.env.OPENAI_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  console.log('OpenAI initialized successfully');
} else {
  console.warn('Warning: OpenAI API key not configured. AI chatbot will not work.');
}

// AI Chatbot endpoint (PII filtering)
app.post('/api/ai', filterPII, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: 'AI service not configured', 
        details: 'To enable AI features, get an OpenAI API key from https://platform.openai.com/api-keys and add it to your .env file as OPENAI_KEY=sk-proj-your-key-here',
        suggestion: 'All other finance tracking features work perfectly without AI!'
      });
    }
    
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages,
    });
    res.json({ message: completion.choices[0].message });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ 
      error: 'AI error', 
      details: 'Sorry, the AI service is temporarily unavailable. Please try again in a moment.',
      suggestion: 'You can continue using your finance dashboard while we work on this!'
    });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Finance routes
app.use('/api/finance', financeRoutes);

// Backup routes
app.use('/api/backup', backupRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
