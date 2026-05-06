const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// @route   GET api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Only allow viewing profiles in the same community
    if (user.uniqueId !== req.user.uniqueId) {
      return res.status(403).json({ msg: 'Not in same community' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/follow/:id
// @desc    Follow or unfollow a user
// @access  Private
router.put('/follow/:id', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ msg: 'User not found' });
    
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user.id);
    } else {
      currentUser.following.unshift(req.params.id);
      targetUser.followers.unshift(req.user.id);
    }

    await currentUser.save();
    await targetUser.save();
    
    res.json({ following: currentUser.following, followers: targetUser.followers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update profile (bio, pic)
// @access  Private
router.put('/profile', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const { bio } = req.body;
    
    const user = await User.findById(req.user.id).select('-password');
    if (bio !== undefined) user.bio = bio;
    
    if (req.file) {
      user.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
