import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Rightbar from './components/Rightbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Events from './components/Events';
import Profile from './components/Profile';
import Messages from './components/Messages';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col font-sans text-gray-900">
          <Navbar />
          
          <AuthContext.Consumer>
            {({ user, loading }) => (
              <div className="max-w-7xl mx-auto w-full px-4 flex justify-center gap-6">
                {!loading && user && <Sidebar />}
                
                <main className="flex-1 max-w-2xl py-6 w-full pb-20 md:pb-6">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    <Route path="/marketplace" element={
                      <PrivateRoute>
                        <Marketplace />
                      </PrivateRoute>
                    } />
                    <Route path="/events" element={
                      <PrivateRoute>
                        <Events />
                      </PrivateRoute>
                    } />
                    <Route path="/profile/:id" element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/messages" element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    } />
                  </Routes>
                </main>

                {!loading && user && <Rightbar />}
                
                {/* Mobile Floating Action Button */}
                {!loading && user && (
                  <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                )}
              </div>
            )}
          </AuthContext.Consumer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
