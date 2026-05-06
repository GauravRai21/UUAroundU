import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Mail, UserPlus, Users, Grid } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Post from './Post';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: '' });
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUserId = currentUser?._id || currentUser?.id;
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`);
        setProfile(res.data);
        setIsFollowing(res.data.followers?.includes(currentUserId));
        setEditData({ bio: res.data.bio || '' });
        
        // Quick workaround to fetch user's posts
        const postsRes = await axios.get('http://localhost:5000/api/posts');
        setPosts(postsRes.data.filter(p => p.userId._id === id || p.userId === id));
      } catch (err) {
        console.error('Error fetching profile', err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id, currentUser.id]);

  const handleFollow = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/follow/${id}`);
      setIsFollowing(!isFollowing);
      setProfile({
        ...profile,
        followers: res.data.followers
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('bio', editData.bio);
      if (editFile) {
        formData.append('profilePic', editFile);
      }

      const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, bio: res.data.bio, profilePic: res.data.profilePic });
      setIsEditing(false);
      setEditFile(null);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading Profile...</div>;
  if (!profile) return <div className="text-center py-10">User not found.</div>;

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = currentUserId === id;

  return (
    <div className="w-full">
      {/* Cover & Avatar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary-400 to-primary-600 relative"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 shadow-sm overflow-hidden">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0)
              )}
            </div>
            
            {!isOwnProfile ? (
              <button 
                onClick={handleFollow}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-sm'
                }`}
              >
                {!isFollowing && <UserPlus size={16} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-full border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin size={14} /> {profile.college} 
            </p>
          </div>
          
          <p className="mt-4 text-gray-700 text-sm max-w-lg">
            {profile.bio || "This user hasn't added a bio yet."}
          </p>
          
          <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{profile.followers?.length || 0}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Followers</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{profile.following?.length || 0}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="flex gap-6 mb-6">
        <button className="text-primary-600 font-bold pb-2 border-b-2 border-primary-600 flex items-center gap-2">
          <Grid size={18} /> Posts
        </button>
      </div>

      {/* User's Posts */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => <Post key={post._id} post={post} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
            No posts yet.
          </div>
        )}
      </div>
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  value={editData.bio} 
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Tell your community about yourself..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
