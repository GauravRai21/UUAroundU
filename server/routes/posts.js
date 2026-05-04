const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isVerified = require('../middleware/isVerified');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, isVerified], async (req, res) => {
  try {
    const { content, image, postType, hashtags, pollOptions } = req.body;
    
    if (!content && postType !== 'poll') {
      return res.status(400).json({ msg: 'Post content is required' });
    }

    const newPost = new Post({
      userId: req.user.id,
      content: content || '',
      image,
      college: req.user.college, // Legacy
      uniqueId: req.user.uniqueId, // Scoped to community
      postType: postType || 'normal',
      hashtags: hashtags || [],
      pollOptions: pollOptions || []
    });

    const post = await newPost.save();
    
    // Populate user details for immediate return
    await post.populate('userId', ['name']);
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts
// @desc    Get all posts for user's community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Only fetch posts from the same community (uniqueId)
    // Fallback to college for backward compatibility if uniqueId is missing in DB
    const posts = await Post.find({
      $or: [
        { uniqueId: req.user.uniqueId },
        { college: req.user.college }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('userId', ['name', 'profilePic']);
      
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like or Unlike a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike (remove from array)
      post.likes.splice(likeIndex, 1);
    } else {
      // Like (add to array)
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [auth, isVerified], async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      text
    });

    const comment = await newComment.save();
    await comment.populate('userId', ['name']);
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/comments/:id
// @desc    Get comments for a post
// @access  Private
router.get('/comments/:id', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('userId', ['name']);
      
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
