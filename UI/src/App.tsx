import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
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
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
