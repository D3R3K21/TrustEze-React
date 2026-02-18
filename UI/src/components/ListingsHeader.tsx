import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import SearchFilters from './SearchFilters';
import type { SearchFilters as SearchFiltersType } from '../types';
import './ListingsHeader.css';

export interface ListingsHeaderProps {
  /** When provided, the new horizontal filter bar (SearchFilters) is shown and drives search. */
  filters?: SearchFiltersType;
  onFiltersChange?: (filters: SearchFiltersType) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

const ListingsHeader: React.FC<ListingsHeaderProps> = ({
  filters = {},
  onFiltersChange = () => {},
  onSearch = () => {},
  onClear = () => {},
}) => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Get dashboard path based on user role
  const getDashboardPath = (): string => {
    if (!user || !user.roles || user.roles.length === 0) {
      return '/dashboard';
    }

    const roles = user.roles.map((r) => r.name?.toLowerCase());
    
    // Priority: Investor > Buyer > Admin
    if (roles.includes('investor')) {
      return '/investor';
    } else if (roles.includes('buyer')) {
      return '/homebuyer';
    } else if (roles.includes('admin')) {
      // Admin defaults to investor dashboard
      return '/investor';
    }
    
    return '/dashboard';
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: '#f5f5f5',
        color: '#333',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
        marginTop: 0,
      }}
    >
      <Toolbar 
        sx={{ 
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '0 !important',
          minHeight: 'auto',
        }}
      >
        {/* Top Section: Branding and Navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          {/* Branding */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#1a1a1a',
                textDecoration: 'none',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              TRUSTKEYS
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginLeft: '0.5rem',
              }}
            >
              <Box
                sx={{
                  width: '60px',
                  height: '1px',
                  backgroundColor: '#1a1a1a',
                  marginBottom: '2px',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'sans-serif',
                  color: '#1a1a1a',
                  fontSize: { xs: '0.7rem', md: '0.875rem' },
                  letterSpacing: '0.05em',
                }}
              >
                HOMES
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: '#1a1a1a',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/listings"
              sx={{
                color: '#1a1a1a',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Listings
            </Button>
            <Button
              component={Link}
              to="/contact"
              sx={{
                color: '#1a1a1a',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Contact
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to={getDashboardPath()}
                  sx={{
                    color: '#1a1a1a',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 400,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: '#1a1a1a',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 400,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#1a1a1a',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        {/* Bottom Section: Horizontal filter bar (SearchFilters) */}
        <Box sx={{ padding: '1rem 2rem' }}>
          <SearchFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSearch={onSearch}
            onClear={onClear}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ListingsHeader;

