const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user details by email
router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user details as response
        res.status(200).json({ user });
    } catch (error) {
        // Log and send error message
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



// Update SOS state to true
router.post('/update-sos', async (req, res) => {
    const { email ,sos} = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the sos field to true
      user.sos = sos;
      await user.save();
  
      res.status(200).json({ message: 'SOS state updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update SOS state' });
    }
  });
  


module.exports = router;
