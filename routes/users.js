const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Update user profile
router.put('/:id', async (req, res) => {
  
});

module.exports = router;