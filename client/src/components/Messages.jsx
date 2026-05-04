import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('userId');

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(targetUserId || null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);
      
      const currentUserId = user._id || user.id;
      newSocket.emit('join_user', currentUserId);

      return () => newSocket.disconnect();
    }
  }, [user]);

  // Load Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  // Fetch active chat
  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/messages/${activeChatId}`);
          setMessages(res.data);
          
          // Also fetch the user details if not in conversations
          const conv = conversations.find(c => c.userId === activeChatId);
          if (conv) {
            setActiveChatUser(conv.user);
          } else {
            const userRes = await axios.get(`http://localhost:5000/api/users/profile/${activeChatId}`);
            setActiveChatUser(userRes.data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();
    }
  }, [activeChatId, conversations]);

  // Handle incoming messages
  useEffect(() => {
    if (socket) {
      socket.on('receive_private_message', (message) => {
        // If the message belongs to the active chat
        if (activeChatId && (message.senderId._id === activeChatId || message.senderId === activeChatId)) {
          setMessages((prev) => [...prev, message]);
        }
        
        // Update conversation sidebar
        setConversations(prev => {
          const newConvs = [...prev];
          const existingConvIndex = newConvs.findIndex(c => c.userId === message.senderId._id || c.userId === message.senderId);
          
          if (existingConvIndex >= 0) {
            newConvs[existingConvIndex].lastMessage = message.text;
            newConvs[existingConvIndex].createdAt = new Date().toISOString();
          } else {
            // Need to fetch or construct new conversation object
            // (A quick reload is easiest, but let's just trigger a reload)
            axios.get('http://localhost:5000/api/messages').then(res => setConversations(res.data));
          }
          return newConvs;
        });
      });
    }
    return () => {
      if (socket) socket.off('receive_private_message');
    };
  }, [socket, activeChatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/messages', {
        receiverId: activeChatId,
        text: newMessage
      });

      setMessages([...messages, res.data]);
      setNewMessage('');
      
      if (socket) {
        socket.emit('send_private_message', res.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Your account is not verified. Please upload your ID and wait for approval to send messages.');
      } else {
        console.error(err);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const currentUserId = user?._id || user?.id;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex h-[80vh] overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="text" placeholder="Search messages" className="w-full bg-gray-50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div 
              key={conv.userId} 
              onClick={() => setActiveChatId(conv.userId)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChatId === conv.userId ? 'bg-primary-50' : ''}`}
            >
              {conv.user?.profilePic ? (
                <img src={conv.user.profilePic} alt={conv.user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-lg">
                  {conv.user?.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{conv.user?.name}</h3>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(conv.createdAt))}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations yet. Go to Marketplace or a User's Profile to start chatting!
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChatId ? (
        <div className={`flex-1 flex flex-col ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <button className="md:hidden p-2 -ml-2 text-gray-500" onClick={() => setActiveChatId(null)}>
              <ArrowLeft size={20} />
            </button>
            {activeChatUser?.profilePic ? (
              <img src={activeChatUser.profilePic} alt={activeChatUser.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                {activeChatUser?.name?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{activeChatUser?.name}</h3>
              <p className="text-xs text-gray-500">{activeChatUser?.college}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => {
              const isMine = msg.senderId._id === currentUserId || msg.senderId === currentUserId;
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`text-[10px] mt-1 ${isMine ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full pr-1 pl-4 py-1">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 flex-col gap-4 text-gray-400">
          <MessageSquare size={48} className="text-gray-300" />
          <p className="text-sm font-medium">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
