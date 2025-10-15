import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Temp from './pages/Temp';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Homebuyer from './pages/Homebuyer';
import Investor from './pages/Investor';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Temp />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/homebuyer" element={<Homebuyer />} />
                    <Route path="/investor" element={<Investor />} />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Layout>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
