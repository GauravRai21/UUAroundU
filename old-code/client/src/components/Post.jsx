import React, { useState, useContext } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Post = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = likes.includes(user?.id);

  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/like/${post._id}`);
      setLikes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/comments/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, { text: commentText });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const isAlert = post.postType === 'alert';
  const isPoll = post.postType === 'poll';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-sm border p-5 mb-4 ${isAlert ? 'border-red-200 border-l-4 border-l-red-500' : 'border-gray-100'}`}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.userId?.profilePic ? (
            <img src={post.userId.profilePic} alt={post.userId.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center font-bold">
              {post.userId?.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900 leading-tight">{post.userId?.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {isAlert && <span className="text-red-500 flex items-center gap-0.5 ml-2 font-medium"><AlertTriangle size={12}/> Emergency Alert</span>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <p className={`whitespace-pre-wrap mb-3 text-gray-800 ${isAlert ? 'font-medium' : ''}`}>
        {post.content}
      </p>
      
      {/* Image */}
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
          <img src={post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
        </div>
      )}

      {/* Poll */}
      {isPoll && post.pollOptions?.length > 0 && (
        <div className="space-y-2 mb-4">
          {post.pollOptions.map((opt, idx) => {
            // Very basic poll display
            const voteCount = opt.votes ? opt.votes.length : 0;
            return (
              <div key={idx} className="relative w-full h-10 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 flex items-center px-4">
                <div className="absolute left-0 top-0 bottom-0 bg-primary-100 z-0" style={{ width: `${Math.min((voteCount / (likes.length || 1)) * 100, 100)}%` }}></div>
                <span className="relative z-10 text-sm font-medium text-gray-800">{opt.text}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-500">
        <div className="flex gap-6">
          <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">{likes.length}</span>
          </button>
          <button onClick={toggleComments} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{comments.length || 'Comment'}</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-green-600 transition-colors hidden sm:flex">
            <Share2 size={20} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
        <button className="hover:text-yellow-600 transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </form>

          <div className="space-y-4 pl-2">
            {comments.map(comment => (
              <div key={comment._id} className="flex gap-3">
                {comment.userId?.profilePic ? (
                  <img src={comment.userId.profilePic} alt={comment.userId.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {comment.userId?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2.5 inline-block">
                    <div className="font-semibold text-sm text-gray-900">{comment.userId?.name}</div>
                    <div className="text-sm text-gray-800">{comment.text}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-2">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && <div className="text-center text-sm text-gray-500 py-2">No comments yet. Be the first!</div>}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Post;
