const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Note = require('../models/Note');

// Initialize Groq client
// It automatically uses process.env.GROQ_API_KEY
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// POST /api/ask
router.post('/', async (req, res) => {
    try {
        const { question, noteId } = req.body;

        if (!question || !noteId) {
            return res.status(400).json({ message: 'Both question and noteId are required' });
        }

        // 1. Find note by ID
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // 2. Build good system prompt
        const systemPrompt = `You are a helpful study tutor. 
Use ONLY this context from the student's notes to answer their question. 
Answer clearly, use bullet points when helpful.

<context>
Title: ${note.title}
Content: ${note.content}
</context>`;

        // 3. Call Groq chat completions API
        const startTime = Date.now();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: question
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
        });

        const answer = chatCompletion.choices[0]?.message?.content || "No response generated.";

        // 4. Measure time taken
        const responseTimeMs = Date.now() - startTime;

        // 5. Return response
        res.json({
            answer,
            responseTimeMs
        });

    } catch (error) {
        console.error("Error calling Groq API:", error);
        res.status(500).json({
            message: 'An error occurred while generating the answer.',
            error: error.message
        });
    }
});

module.exports = router;
