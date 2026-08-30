const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatSession = require('./models/Chat');
const SYSTEM_PROMPT = require('./config/prompt');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolioAPI';

// Connect to MongoDB gracefully
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Failed to connect to MongoDB:', err.message));

// Routes
app.post('/api/chat', async (req, res) => {
    const { sessionId, message, history: clientHistory = [] } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ error: "sessionId and message are required" });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('MISSING_API_KEY')) {
            throw new Error("GEMINI_API_KEY is not configured on the server. Please update the .env file.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.6-flash',
            systemInstruction: SYSTEM_PROMPT
        });

        // Filter out assistant system startup messages to prevent Google SDK crashes
        const history = clientHistory
            .filter(m => !(m.role === 'model' && m.content && m.content.includes("API Key successfully configured")))
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

        const chat = model.startChat({ history });

        // Save User Message to DB safely
        let session = null;
        if (mongoose.connection.readyState === 1) {
            session = await ChatSession.findOne({ sessionId });
            if (!session) session = new ChatSession({ sessionId, messages: [] });

            session.messages.push({ role: 'user', content: message });
            await session.save().catch(e => console.error("Could not save to DB:", e));
        }

        const result = await chat.sendMessageStream(message);
        let fullText = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // Save AI Response to DB safely
        if (session && mongoose.connection.readyState === 1) {
            session.messages.push({ role: 'assistant', content: fullText });
            await session.save().catch(e => console.error("Could not save to DB:", e));
        }

    } catch (error) {
        console.error('Chat error:', error.message || error);
        res.write(`data: ${JSON.stringify({ error: error.message || "An unexpected error occurred" })}\n\n`);
        res.end();
    }
});

app.get('/api/history', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "Database not connected" });
        }

        const sessions = await ChatSession.find({})
            .sort({ createdAt: -1 })
            .select('sessionId messages createdAt')
            .lean();

        const validSessions = sessions.filter(s => s.messages && s.messages.length > 0);
        res.json(validSessions);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Auto-recovery endpoint to grab the key from the browser and inject without rebooting
app.post('/api/key', (req, res) => {
    const { key } = req.body;
    if (key && key.length > 10) {
        const fs = require('fs');
        let envContent = '';
        if (fs.existsSync('.env')) {
            envContent = fs.readFileSync('.env', 'utf8');
        }

        if (envContent.includes('GEMINI_API_KEY=')) {
            envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${key}`);
        } else {
            envContent += `\nGEMINI_API_KEY=${key}\n`;
        }

        fs.writeFileSync('.env', envContent);
        process.env.GEMINI_API_KEY = key; // Seamless memory update!
        console.log("✅ API key stored in .env and injected into Node process!");
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Invalid key" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
