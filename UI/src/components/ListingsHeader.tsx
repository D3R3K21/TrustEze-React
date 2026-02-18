import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { colors } from '../theme';
import './ListingsHeader.css';

const ListingsHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [bedsBathsFilter, setBedsBathsFilter] = useState('');
  const [homeTypeFilter, setHomeTypeFilter] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
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

        {/* Bottom Section: Search and Filters */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '1rem 2rem',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search for homes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 auto' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: '#b0b0b0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                },
              },
            }}
          />

          {/* Filter Buttons */}
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: colors.primary,
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              minWidth: '140px',
              height: '48px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: colors.primaryHover,
              },
            }}
          >
            Search
          </Button>

          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: '140px' },
              height: '48px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary,
                borderRadius: '8px',
                color: '#fff',
                height: '48px',
                '& fieldset': {
                  borderColor: colors.primary,
                },
                '&:hover fieldset': {
                  borderColor: colors.primaryHover,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primaryHover,
                },
              },
            }}
          >
            <Select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#fff' }}>Price</span>;
                }
                return <span style={{ color: '#fff' }}>{selected}</span>;
              }}
              sx={{
                color: '#fff',
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            >
              <MenuItem value="0-200k">$0 - $200k</MenuItem>
              <MenuItem value="200k-400k">$200k - $400k</MenuItem>
              <MenuItem value="400k-600k">$400k - $600k</MenuItem>
              <MenuItem value="600k-800k">$600k - $800k</MenuItem>
              <MenuItem value="800k+">$800k+</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: '160px' },
              height: '48px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary,
                borderRadius: '8px',
                color: '#fff',
                height: '48px',
                '& fieldset': {
                  borderColor: colors.primary,
                },
                '&:hover fieldset': {
                  borderColor: colors.primaryHover,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primaryHover,
                },
              },
            }}
          >
            <Select
              value={bedsBathsFilter}
              onChange={(e) => setBedsBathsFilter(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#fff' }}>Beds/Baths</span>;
                }
                return <span style={{ color: '#fff' }}>{selected}</span>;
              }}
              sx={{
                color: '#fff',
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            >
              <MenuItem value="1bed1bath">1 bed / 1 bath</MenuItem>
              <MenuItem value="2bed2bath">2 bed / 2 bath</MenuItem>
              <MenuItem value="3bed2bath">3 bed / 2 bath</MenuItem>
              <MenuItem value="4bed3bath">4 bed / 3 bath</MenuItem>
              <MenuItem value="5bed+">5+ bed</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: '150px' },
              height: '48px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary,
                borderRadius: '8px',
                color: '#fff',
                height: '48px',
                '& fieldset': {
                  borderColor: colors.primary,
                },
                '&:hover fieldset': {
                  borderColor: colors.primaryHover,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primaryHover,
                },
              },
            }}
          >
            <Select
              value={homeTypeFilter}
              onChange={(e) => setHomeTypeFilter(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#fff' }}>Home Type</span>;
                }
                return <span style={{ color: '#fff' }}>{selected}</span>;
              }}
              sx={{
                color: '#fff',
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            >
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="condo">Condo</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.primary,
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              minWidth: '140px',
              height: '48px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: colors.primaryHover,
              },
            }}
          >
            More
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ListingsHeader;

