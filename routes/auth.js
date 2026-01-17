const express = require('express');
const router = express.Router();
import { signup, login, logout } from '../controllers/authControllers';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many requests, please try again later.',
});


// Register user
router.post('/register', limiter, signup);

// Login user
router.post('/login', limiter, login);

// Get user profile
router.get('/logout', limiter, logout);

export default router;