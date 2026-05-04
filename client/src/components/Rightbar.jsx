import React, { useContext } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Rightbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hidden lg:flex flex-col w-80 h-[calc(100vh-4rem)] sticky top-16 pt-6 pl-6">
      
      {/* Community Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-primary-500" />
          Your Community
        </h3>
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900">{user?.college || 'No Community'}</p>
          <p className="mt-1">UID: {user?.uniqueId}</p>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-500" />
          Trending Topics
        </h3>
        <ul className="space-y-3">
          {['#CampusLife', '#Housing', '#LostAndFound', '#StudyGroup'].map((tag, i) => (
            <li key={i} className="text-sm font-medium text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming Events Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="text-sm text-gray-500 text-center py-4">
          No upcoming events.
        </div>
      </div>

    </div>
  );
};

export default Rightbar;
