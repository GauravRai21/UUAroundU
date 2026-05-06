import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, MessageSquare, LogOut, Hexagon, User as UserIcon, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSearch = async () => {
      if (query.trim().length < 2) {
        setResults({ users: [], posts: [] });
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <Hexagon size={28} className="fill-primary-600 text-primary-600" />
          <span>Campus<span className="text-gray-900">Pro</span></span>
        </Link>
        
        {/* Search Bar (Center) */}
        {user && (
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={dropdownRef}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200" 
                placeholder="Search community, posts, or people..." 
              />
            </div>
            
            {/* Search Dropdown */}
            {showDropdown && query.trim().length >= 2 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
                {results.users.length === 0 && results.posts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No results found</div>
                ) : (
                  <>
                    {results.users.length > 0 && (
                      <div className="p-2 border-b border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">People</h4>
                        {results.users.map(u => (
                          <div 
                            key={u._id} 
                            onClick={() => { navigate(`/profile/${u._id}`); setShowDropdown(false); setQuery(''); }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {results.posts.length > 0 && (
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">Posts</h4>
                        {results.posts.map(p => (
                          <div 
                            key={p._id}
                            onClick={() => { navigate(`/`); setShowDropdown(false); setQuery(''); }} 
                            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                          >
                            <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-900 line-clamp-2">{p.content}</div>
                              <div className="text-xs text-gray-500 mt-0.5">by {p.userId?.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {user ? (
            <>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                <MessageSquare size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-gray-900 leading-none">{user.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{user.uniqueId}</div>
                </div>
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-9 h-9 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">Sign In</Link>
              <Link to="/register" className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-primary-700 transition-colors shadow-sm hover:shadow">Join Now</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
