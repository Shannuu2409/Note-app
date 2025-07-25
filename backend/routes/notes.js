import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all notes
router.get("/", protect, async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id });
        res.json(notes);
    } catch (err) {
        console.error("Get all Notes:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Create a note
router.post("/", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }
        const note = await Note.create({
            title,
            description,
            createdBy: req.user._id
        });
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single note
router.get("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        note.title = title || note.title;
        note.description = description || note.description;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await note.deleteOne();
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/test", (req, res) => {
    res.send("Notes route is working!");
});

export default router;