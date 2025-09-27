
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'All fields are required',
      details: 'Name, email, and password must be provided' 
    });
  }
  
  // Basic email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format',
      details: 'Please provide a valid email address' 
    });
  }
  
  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password too short',
      details: 'Password must be at least 6 characters long' 
    });
  }
  
  next();
};

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User already exists',
        details: 'An account with this email address already exists' 
      });
    }

    // Create new user (password will be hashed automatically by the pre-save middleware)
    const newUser = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password 
    });
    
    const savedUser = await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        email: savedUser.email 
      }, 
      process.env.JWT_SECRET || 'your-default-secret', // Make sure to set JWT_SECRET in environment
      { expiresIn: '7d' }
    );
    
    // Return success response with user data (excluding password)
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt
      },
      token
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        details: errors.join(', ')
      });
    }
    
    // Handle duplicate key error (email already exists)
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: 'User already exists',
        details: 'An account with this email address already exists' 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      message: 'Registration failed',
      details: 'An internal server error occurred. Please try again later.'
    });
  }
});

// Login route (improved)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Login failed',
      details: 'An internal server error occurred. Please try again later.' 
    });
  }
});

module.exports = router;


