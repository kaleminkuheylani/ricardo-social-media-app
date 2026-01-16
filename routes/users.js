const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  
});

// Login user
router.post('/login', async (req, res) => {
  
});

// Get user profile
router.get('/:id', async (req, res) => {
  
});

// Update user profile
router.put('/:id', async (req, res) => {
  
});

module.exports = router;