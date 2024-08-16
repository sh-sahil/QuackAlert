const express = require('express');
const router = express.Router();
const ResponseTeam = require('../models/ResponseTeam');

// GET all response team members
router.get('/', async (req, res) => {
    try {
        const responseTeam = await ResponseTeam.find();
        res.status(200).json(responseTeam);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching response team data', error: err });
    }
});

// GET a specific response team member by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const responseTeamMember = await ResponseTeam.findById(id);
        if (responseTeamMember) {
            res.status(200).json(responseTeamMember);
        } else {
            res.status(404).json({ message: 'Response team member not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching response team member', error: err });
    }
});

// POST a new response team member
router.post('/', async (req, res) => {
    const { name, role, phone, email, location, status } = req.body;
    try {
        const newResponseTeam = new ResponseTeam({ name, role, phone, email, location, status });
        await newResponseTeam.save();
        res.status(201).json(newResponseTeam);
    } catch (err) {
        res.status(400).json({ message: 'Error creating response team member', error: err });
    }
});

// PUT update a response team member by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedResponseTeam = await ResponseTeam.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedResponseTeam) {
            res.status(200).json(updatedResponseTeam);
        } else {
            res.status(404).json({ message: 'Response team member not found' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Error updating response team member', error: err });
    }
});

// Delete a response team member by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ResponseTeam.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Response team member deleted successfully' });
        } else {
            res.status(404).json({ message: 'Response team member not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting response team member', error: err });
    }
});

module.exports = router;
