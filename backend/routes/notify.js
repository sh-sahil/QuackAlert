const express = require('express');
const router = express.Router();
const ResponseTeam = require('../models/ResponseTeam');
const sendEmail = require('../utils/sendNotification'); // Utility function to send notifications

// Get response team members
router.get('/get-team-members', async (req, res) => {
  try {
    const teamMembers = await ResponseTeam.find();
    res.status(200).json(teamMembers);
  } catch (error) {
    console.error('Failed to fetch response team members:', error);
    res.status(500).json({ error: 'Failed to fetch response team members' });
  }
});

// Send notification to response team members
router.post('/send-notification', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const teamMembers = await ResponseTeam.find({ status: 'Active' });
    const notifications = teamMembers.map(member => {
      return sendEmail(member.email, 'Emergency Alert', member.name, message);
    });

    await Promise.all(notifications);
    res.status(200).json({ message: 'Response team members notified successfully' });
  } catch (error) {
    console.error('Failed to notify response team members:', error);
    res.status(500).json({ error: 'Failed to notify response team members' });
  }
});

module.exports = router;
