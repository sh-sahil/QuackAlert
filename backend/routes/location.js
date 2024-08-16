const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to update user location
router.post('/update-location', async (req, res) => {
  const { email, lat, long } = req.body;

  try {
    // Update user document with latitude and longitude
    const user = await User.findOneAndUpdate(
      { email },
      { lat, long },
      { new: true, upsert: true } // Create new user if not found
    );

    res.status(200).json({ message: 'Location updated successfully', user });
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
