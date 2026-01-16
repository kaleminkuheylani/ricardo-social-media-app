const express = require('express');
const Like = require('../models/Like');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Like/unlike a post
router.post('/', auth, async (req, res) => {
  try {
    
});

// Get likes for a post
router.get('/post/:postId', async (req, res) => {
  
});

// Get like count for a post
router.get('/count/:postId', async (req, res) => {
  
});

// Check if user liked a post
router.get('/check/:postId', auth, async (req, res) => {
  
});

// Get likes by user
router.get('/user/:userId', async (req, res) => {
  
});

module.exports = router;