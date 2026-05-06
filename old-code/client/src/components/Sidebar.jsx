import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { Home, Compass, Calendar, ShoppingBag, MessageSquare, Bell, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (user) {
        try {
          const res = await axios.get('http://localhost:5000/api/messages/unread');
          setUnreadCount(res.data.count);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUnread();
    
    // Poll every 10 seconds to keep sidebar badge updated
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const links = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={22} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={22} /> },
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={22} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={22} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={22} /> },
    { name: 'Profile', path: `/profile/${user?._id || user?.id}`, icon: <UserIcon size={22} /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 pt-6 pr-4 border-r border-gray-200">
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <div className="relative">
              {link.icon}
              {link.name === 'Messages' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[15px]">{link.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto pb-6 px-4">
        <button className="w-full bg-primary-600 text-white rounded-full py-3 font-semibold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
