const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   GET api/messages
// @desc    Get all unique users the current user has chatted with
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });

    const chatUsers = new Map();
    
    // Extract unique conversation partners and the latest message
    for (let msg of messages) {
      const partnerId = msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString();
      if (!chatUsers.has(partnerId)) {
        chatUsers.set(partnerId, {
          userId: partnerId,
          lastMessage: msg.text,
          createdAt: msg.createdAt,
          isRead: msg.isRead
        });
      }
    }

    const conversations = [];
    for (let [id, data] of chatUsers) {
      const user = await User.findById(id).select('name profilePic college');
      if (user) {
        conversations.push({ ...data, user });
      }
    }

    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/unread
// @desc    Get total unread messages count
// @access  Private
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/:userId
// @desc    Get chat history with a specific user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest
    
    // Mark as read
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) return res.status(400).json({ msg: 'Missing fields' });

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      text,
      uniqueId: req.user.uniqueId
    });

    const savedMessage = await newMessage.save();
    
    // Populate sender info before returning (useful for sockets)
    await savedMessage.populate('senderId', ['name', 'profilePic']);
    
    res.json(savedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
