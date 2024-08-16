const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().lean(); // Fetch all users and convert to plain JavaScript objects
        res.status(200).json(users); // Ensure the response is an array
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Toggle sosStatus for a specific user by email
router.patch('/toggle-sos-status/:email', async (req, res) => {
    try {
        const { email } = req.params; // Get user email from URL parameters
        const user = await User.findOne({ email }); // Find user by email

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle sosStatus value
        user.sosStatus = !user.sosStatus;

        // Save the updated user
        const updatedUser = await user.save();

        // Respond with the updated user
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error toggling sosStatus:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


module.exports = router;
