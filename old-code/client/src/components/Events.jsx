import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events', err);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/events/rsvp/${eventId}`);
      setEvents(events.map(ev => {
        if (ev._id === eventId) return { ...ev, attendees: res.data };
        return ev;
      }));
    } catch (err) {
      console.error('RSVP failed', err);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">Discover what's happening around campus</p>
        </div>
        <button className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2">
          <Plus size={18} /> Create Event
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => <div key={n} className="bg-white rounded-xl border border-gray-100 h-40 animate-pulse"></div>)}
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((ev, i) => {
            const dateObj = new Date(ev.date);
            const month = format(dateObj, 'MMM');
            const day = format(dateObj, 'dd');
            const isGoing = ev.attendees.includes(user.id);

            return (
              <motion.div 
                key={ev._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow"
              >
                {/* Date Badge */}
                <div className="sm:w-32 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100 flex flex-col items-center justify-center p-4">
                  <span className="text-red-500 font-bold text-sm uppercase tracking-wider">{month}</span>
                  <span className="text-3xl font-black text-gray-900 leading-none my-1">{day}</span>
                </div>
                
                {/* Event Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{ev.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ev.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 mb-4 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} /> {ev.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <MapPin size={14} /> {ev.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium col-span-2">
                      <Users size={14} /> {ev.attendees.length} attending
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {ev.creatorId?.name?.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-500">Hosted by <span className="font-semibold text-gray-700">{ev.creatorId?.name}</span></span>
                    </div>
                    
                    <button 
                      onClick={() => handleRSVP(ev._id)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        isGoing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' 
                          : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                      }`}
                    >
                      {isGoing ? 'Cancel RSVP' : 'RSVP Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No events found</h3>
          <p className="text-gray-500">There are no upcoming events in your community.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
