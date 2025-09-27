const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user controller
exports.registerUser = async (req, res) => {
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

    // Create new user
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
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '7d' }
    );
    
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
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        details: errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      message: 'Registration failed',
      details: 'An internal server error occurred'
    });
  }
};

// Login user controller
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and check password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
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
      details: 'An internal server error occurred'
    });
  }
};