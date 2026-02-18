import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { colors } from '../theme';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#1a1a1a', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ color: '#1a1a1a', mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 4, maxWidth: '500px' }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            component={Link}
            to="/"
            sx={{
              backgroundColor: colors.primary,
              color: '#fff',
              textTransform: 'none',
              padding: '0.75rem 2rem',
              '&:hover': {
                backgroundColor: colors.primaryHover,
              },
            }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              textTransform: 'none',
              padding: '0.75rem 2rem',
              '&:hover': {
                borderColor: colors.primaryHover,
                backgroundColor: `${colors.primary}1a`,
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default NotFound;

