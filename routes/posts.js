const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name username')
      .populate('likes')
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name username')
      .populate('likes')
      .populate('comments');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, description, photo } = req.body;
    const post = new Post({
      userId: req.userId,
      title,
      content,
      description,
      photo
    });
    
    await post.save();
    await post.populate('userId', 'name username');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, description, photo } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  
});

module.exports = router;