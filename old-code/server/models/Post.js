const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL of the image
    default: null,
  },
  college: {
    type: String,
    required: false, // Legacy field
  },
  uniqueId: {
    type: String,
    required: true, // New field for community isolation
  },
  postType: {
    type: String,
    enum: ['normal', 'poll', 'alert'],
    default: 'normal'
  },
  hashtags: [{ type: String }],
  pollOptions: [{
    text: { type: String },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
