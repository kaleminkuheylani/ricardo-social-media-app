const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  
});

// Create comment
router.post('/', auth, async (req, res) => {
  
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  
});

// Get comments by user
router.get('/user/:userId', async (req, res) => {
  
});

module.exports = router;