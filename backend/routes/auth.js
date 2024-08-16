const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, location, username, lat, long } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword, location, username, lat, long });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// Login Route 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result: existingUser, token ,  });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
// to get user details
router.get('/user/:email',async(req,res)=>{
  const {email} = req.params;
  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.status(200).json({user});
  }catch(error){
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }

});
module.exports = router;
