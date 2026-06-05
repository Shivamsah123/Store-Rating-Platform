import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { drawerWidth } from './Sidebar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Layout = () => {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', gap: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(79,106,240,0.4)' }}>
          <StarIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <CircularProgress size={28} thickness={4} />
        <Typography variant="body2" color="text.secondary" fontWeight={600}>Loading your workspace...</Typography>
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const isRootPath = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }} />
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
          {!isRootPath && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="outlined"
              size="small"
              sx={{ 
                mb: 3,
                borderColor: 'divider',
                color: 'text.secondary',
                px: 2,
                py: 0.75,
                borderRadius: 2,
                fontSize: '0.8125rem',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              Back
            </Button>
          )}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
