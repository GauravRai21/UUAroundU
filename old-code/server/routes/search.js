const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET api/search
// @desc    Search users and posts in the community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({ users: [], posts: [] });
    }

    const uniqueId = req.user.uniqueId;

    // Search users by name in the same community
    const users = await User.find({
      uniqueId: uniqueId,
      name: { $regex: q, $options: 'i' }
    }).select('-password').limit(5);

    // Search posts by content or hashtags in the same community
    const posts = await Post.find({
      uniqueId: uniqueId,
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { hashtags: { $regex: q, $options: 'i' } }
      ]
    }).populate('userId', ['name', 'profilePic']).limit(10);

    res.json({ users, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
