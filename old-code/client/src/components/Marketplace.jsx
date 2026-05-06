import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, Tag, Plus, MessageSquare, CheckCircle, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const [sellData, setSellData] = useState({ title: '', description: '', price: '', category: 'Textbooks', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Housing', 'Other'];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const url = category && category !== 'All' 
          ? `http://localhost:5000/api/marketplace?category=${category}` 
          : 'http://localhost:5000/api/marketplace';
        const res = await axios.get(url);
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching marketplace', err);
      }
      setLoading(false);
    };

    fetchListings();
  }, [category]);

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: sellData.title,
        description: sellData.description,
        price: Number(sellData.price),
        category: sellData.category,
        images: sellData.image ? [sellData.image] : []
      };
      const res = await axios.post('http://localhost:5000/api/marketplace', payload);
      setListings([res.data, ...listings]);
      setIsSelling(false);
      setSellData({ title: '', description: '', price: '', category: 'Textbooks', image: '' });
    } catch (err) {
      console.error('Failed to create listing', err);
    }
    setIsSubmitting(false);
  };

  const handleMarkSold = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/marketplace/${id}/sold`);
      setListings(listings.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to mark as sold', err);
    }
  };

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">Buy and sell within {user?.college}</p>
        </div>
        <button onClick={() => setIsSelling(true)} className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2">
          <Plus size={18} /> Sell Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
              (category === cat || (!category && cat === 'All')) 
                ? 'bg-gray-900 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((item, i) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="h-48 bg-gray-100 relative">
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag size={48} opacity={0.2} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg font-bold text-gray-900 shadow-sm">
                  ${item.price}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                </div>
                <div className="text-xs font-medium text-primary-600 bg-primary-50 inline-block px-2 py-1 rounded mb-2 self-start">
                  {item.category}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {item.sellerId?.name?.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500 font-medium truncate">{item.sellerId?.name}</span>
                </div>
                
                {/* Buy / Sell Actions */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  {item.sellerId?._id === (user?._id || user?.id) || item.sellerId === (user?._id || user?.id) ? (
                    <button 
                      onClick={() => handleMarkSold(item._id)}
                      className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition flex justify-center items-center gap-1.5"
                    >
                      <CheckCircle size={16} /> Mark as Sold
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/messages?userId=${item.sellerId?._id || item.sellerId}`)}
                      className="w-full py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition flex justify-center items-center gap-1.5"
                    >
                      <MessageSquare size={16} /> Contact Seller
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No items found</h3>
          <p className="text-gray-500">There are no items listed in this category yet.</p>
        </div>
      )}

      {/* Sell Item Modal */}
      {isSelling && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sell an Item</h2>
            <form onSubmit={handleSellSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" required
                    value={sellData.title} onChange={e => setSellData({...sellData, title: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    placeholder="e.g. Calculus Textbook"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={sellData.price} onChange={e => setSellData({...sellData, price: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={sellData.category} onChange={e => setSellData({...sellData, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none bg-white"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input 
                    type="text" 
                    value={sellData.image} onChange={e => setSellData({...sellData, image: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    required rows="3"
                    value={sellData.description} onChange={e => setSellData({...sellData, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    placeholder="Describe the item condition, pickup location, etc."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsSelling(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Posting...' : 'Post Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
