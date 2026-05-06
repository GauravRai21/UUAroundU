import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Send, Image as ImageIcon, BarChart2, AlertTriangle, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [postType, setPostType] = useState('normal'); // 'normal', 'poll', 'alert'
  const [loading, setLoading] = useState(false);

  // Poll state
  const [pollOptions, setPollOptions] = useState([{ text: '' }, { text: '' }]);

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, { text: '' }]);
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index].text = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && postType !== 'poll') return;

    setLoading(true);
    try {
      const payload = { content, image, postType };
      
      if (postType === 'poll') {
        const validOptions = pollOptions.filter(opt => opt.text.trim() !== '');
        if (validOptions.length < 2) {
          alert('Polls must have at least 2 options');
          setLoading(false);
          return;
        }
        payload.pollOptions = validOptions;
      }

      const res = await axios.post('http://localhost:5000/api/posts', payload);
      onPostCreated(res.data);
      
      // Reset state
      setContent('');
      setImage('');
      setShowImageInput(false);
      setPostType('normal');
      setPollOptions([{ text: '' }, { text: '' }]);
    } catch (err) {
      console.error('Error creating post', err);
    }
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 mb-6 transition-all duration-300 ${postType === 'alert' ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mb-2">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0" />
          )}
          <textarea
            className="w-full bg-transparent resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-lg pt-1.5"
            placeholder={postType === 'alert' ? "What's the emergency?" : postType === 'poll' ? "Ask a question..." : "What's happening in your community?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={content.split('\n').length > 2 ? 3 : 2}
          />
        </div>
        
        {postType === 'poll' && (
          <div className="ml-12 mr-2 mb-4 space-y-2">
            {pollOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                value={opt.text}
                onChange={(e) => handlePollOptionChange(i, e.target.value)}
              />
            ))}
            {pollOptions.length < 4 && (
              <button type="button" onClick={handleAddPollOption} className="text-sm text-primary-600 font-medium hover:underline">
                + Add Option
              </button>
            )}
          </div>
        )}

        {showImageInput && postType !== 'poll' && (
          <div className="ml-12 mr-2 mb-4 relative">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
              placeholder="Paste image URL..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <button type="button" onClick={() => setShowImageInput(false)} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center ml-12 pt-3 border-t border-gray-100">
          <div className="flex gap-1">
            <button 
              type="button" 
              onClick={() => { setPostType('normal'); setShowImageInput(!showImageInput); }}
              className={`p-2 rounded-full transition-colors ${showImageInput ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Add Image"
            >
              <ImageIcon size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setPostType(postType === 'poll' ? 'normal' : 'poll')}
              className={`p-2 rounded-full transition-colors ${postType === 'poll' ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Create Poll"
            >
              <BarChart2 size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setPostType(postType === 'alert' ? 'normal' : 'alert')}
              className={`p-2 rounded-full transition-colors ${postType === 'alert' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Post Alert"
            >
              <AlertTriangle size={20} />
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || (!content.trim() && postType !== 'poll')}
            className={`px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all duration-200 ${
              postType === 'alert' 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' 
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {loading ? 'Posting...' : <><Send size={16} /> Post</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
