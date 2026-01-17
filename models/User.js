const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: false
  },
  avatarProfile: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  },
  tokenVersion: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);