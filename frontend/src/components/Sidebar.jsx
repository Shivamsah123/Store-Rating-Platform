import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';

const drawerWidth = 252;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const menuGroups = {
    ADMIN: [
      { heading: 'Overview', items: [{ text: 'Dashboard', path: '/', icon: <SpaceDashboardOutlinedIcon fontSize="small" /> }] },
      {
        heading: 'Management',
        items: [
          { text: 'Users', path: '/admin/users', icon: <PeopleOutlinedIcon fontSize="small" /> },
          { text: 'Stores', path: '/admin/stores', icon: <StorefrontOutlinedIcon fontSize="small" /> },
          { text: 'Reviews', path: '/admin/reviews', icon: <RateReviewOutlinedIcon fontSize="small" /> },
        ],
      },
    ],
    USER: [
      {
        heading: 'Discover',
        items: [{ text: 'Browse Stores', path: '/', icon: <StorefrontOutlinedIcon fontSize="small" /> }],
      },
      {
        heading: 'Account',
        items: [{ text: 'Security', path: '/profile', icon: <KeyOutlinedIcon fontSize="small" /> }],
      },
    ],
    STORE_OWNER: [
      { heading: 'Analytics', items: [{ text: 'Dashboard', path: '/', icon: <SpaceDashboardOutlinedIcon fontSize="small" /> }] },
      {
        heading: 'Reviews',
        items: [{ text: 'Customer Ratings', path: '/owner/ratings', icon: <RateReviewOutlinedIcon fontSize="small" /> }],
      },
      {
        heading: 'Account',
        items: [{ text: 'Security', path: '/profile', icon: <KeyOutlinedIcon fontSize="small" /> }],
      },
    ],
  };

  const groups = menuGroups[user.role] || [];
  const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };
  const roleLabels = { ADMIN: 'System Admin', USER: 'Customer', STORE_OWNER: 'Store Owner' };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1E2A4A 0%, #111827 100%)',
        color: '#fff',
      }}
    >
      {/* Brand Logo */}
      <Box sx={{ px: 3, pt: 3.5, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,106,240,0.4)', flexShrink: 0 }}>
            <StarIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              RateSync<Box component="span" sx={{ color: '#4F6AF0' }}>Pro</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              ENTERPRISE
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Avatar
            sx={{
              width: 38, height: 38,
              background: `linear-gradient(135deg, ${roleColors[user.role]}, ${roleColors[user.role]}99)`,
              fontSize: '0.875rem', fontWeight: 700,
              boxShadow: `0 2px 10px ${roleColors[user.role]}40`,
              flexShrink: 0,
            }}
          >
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name.split(' ').slice(0, 2).join(' ')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.68rem' }}>
                {roleLabels[user.role]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: 1.5, pb: 2 }}>
        {groups.map((group) => (
          <Box key={group.heading} sx={{ mb: 1 }}>
            <Typography
              variant="overline"
              sx={{ px: 3, color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem', letterSpacing: '0.13em', fontWeight: 700, display: 'block', mb: 0.5, mt: 1.5 }}
            >
              {group.heading}
            </Typography>
            <List dense disablePadding sx={{ px: 1.5 }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={item.text} placement="right" arrow disableHoverListener>
                      <ListItemButton
                        component={NavLink}
                        to={item.path}
                        onClick={mobileOpen ? handleDrawerToggle : undefined}
                        sx={{
                          borderRadius: 1.5,
                          py: 1,
                          px: 1.5,
                          minHeight: 40,
                          position: 'relative',
                          background: isActive
                            ? 'linear-gradient(90deg, rgba(79,106,240,0.25) 0%, rgba(79,106,240,0.08) 100%)'
                            : 'transparent',
                          border: isActive ? '1px solid rgba(79,106,240,0.3)' : '1px solid transparent',
                          '&:hover': {
                            background: isActive
                              ? 'linear-gradient(90deg, rgba(79,106,240,0.3) 0%, rgba(79,106,240,0.1) 100%)'
                              : 'rgba(255,255,255,0.04)',
                          },
                        }}
                      >
                        {isActive && (
                          <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: '65%', borderRadius: '0 2px 2px 0', bgcolor: '#4F6AF0' }} />
                        )}
                        <ListItemIcon sx={{ minWidth: 32, color: isActive ? '#7B93F5' : 'rgba(255,255,255,0.4)' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                          }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom Version Tag */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
          VERSION 1.0.0 · PRODUCTION
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', boxShadow: '2px 0 20px rgba(0,0,0,0.15)' } }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export { drawerWidth };
