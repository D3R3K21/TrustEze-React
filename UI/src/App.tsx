import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Temp from './pages/Temp';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Homebuyer from './pages/Homebuyer';
import Investor from './pages/Investor';
import Listings from './pages/Listings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { useAppDispatch, useAppSelector } from './store/hooks';
import './App.css';

// Component that uses Redux hooks
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredProperties, properties, isLoading } = useAppSelector((state) => state.properties);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('App mounted - fetching data...');

    // No longer calling local API /api/properties/featured
    // dispatch(fetchFeaturedProperties())...

    // No longer calling local API /api/properties?page=1&pageSize=10 – listings use drock/hasdata
    // dispatch(fetchProperties({ page: 1, pageSize: 10 }))
    //   .unwrap()
    //   .then((data) => {
    //     console.log('Properties fetched successfully:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Failed to fetch properties:', error);
    //   });
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
      <ThemeProvider>
        <Router>
          <div className="App">
          <Routes>
            {/* Unprotected routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Listings />} />
            {/* Dashboard routes - must be before catch-all so /homebuyer, /investor etc. match here */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route
                      path="search"
                      element={
                        <ProtectedRoute>
                          <Search />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="homebuyer"
                      element={
                        <RoleProtectedRoute allowedRoles={['Buyer', 'Admin']}>
                          <Homebuyer />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="investor"
                      element={
                        <RoleProtectedRoute allowedRoles={['Investor', 'Admin']}>
                          <Investor />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="profile"
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
            {/* Catch-all for unknown routes - must be last */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
          </Routes>
          </div>
        </Router>
      </ThemeProvider>
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
