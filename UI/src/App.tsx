import React, { useEffect } from 'react';
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
import { fetchFeaturedProperties, fetchProperties } from './store/slices/propertiesSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import './App.css';

// Component that uses Redux hooks
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredProperties, properties, isLoading } = useAppSelector((state) => state.properties);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('App mounted - fetching data...');
    
    // Fetch featured properties (doesn't require auth)
    dispatch(fetchFeaturedProperties())
      .unwrap()
      .then((data) => {
        console.log('Featured properties fetched:', data);
      })
      .catch((error) => {
        console.error('Failed to fetch featured properties:', error);
      });

    // Also fetch regular properties to test
    dispatch(fetchProperties({ page: 1, pageSize: 10 }))
      .unwrap()
      .then((data) => {
        console.log('Properties fetched successfully:', data);
      })
      .catch((error) => {
        console.error('Failed to fetch properties:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (featuredProperties.length > 0) {
      console.log(`Featured properties count: ${featuredProperties.length}`);
    }
  }, [featuredProperties]);

  useEffect(() => {
    if (properties.length > 0) {
      console.log(`Properties count: ${properties.length}`);
    }
  }, [properties]);

  useEffect(() => {
    console.log('Is loading:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('Is authenticated:', isAuthenticated);
  }, [isAuthenticated]);

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
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
