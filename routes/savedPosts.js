const express = require('express');
const SavedPost = require('../models/SavedPost');
const auth = require('../middleware/auth');
const router = express.Router();

// Save/unsave a post
router.post('/', auth, async (req, res) => {
  
});

// Get saved posts for a user
router.get('/user/:userId', auth, async (req, res) => {
  
});

// Check if a post is saved by user
router.get('/check/:postId', auth, async (req, res) => {
  
});

// Delete saved post
router.delete('/:id', auth, async (req, res) => {
  
});

module.exports = router;