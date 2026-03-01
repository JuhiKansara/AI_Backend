const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// POST - Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const newNote = new Note({ title, content, userId });
        const savedNote = await newNote.save();

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET all - Retrieve all notes
router.get('/', async (req, res) => {
    try {
        // Sorting by newest first
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET/:id - Retrieve a specific note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE/:id - Delete a note by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
