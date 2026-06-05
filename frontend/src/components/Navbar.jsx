import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { alpha } from '@mui/material/styles';
import { drawerWidth } from './Sidebar';

const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };

const Navbar = ({ handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { mode, toggleThemeMode } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], stores: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN' || !searchQuery.trim()) {
      setSearchResults({ users: [], stores: [] });
      setShowDrop(false);
      return;
    }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      setShowDrop(true);
      try {
        const res = await api.get(`/admin/global-search?q=${searchQuery}`);
        setSearchResults(res.data.data);
      } catch {}
      finally { setSearchLoading(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, user]);

  useEffect(() => {
    const fn = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearchClick = (type, id) => {
    setShowDrop(false); setSearchQuery('');
    if (type === 'user') navigate(`/admin/users/${id}`);
    else navigate(`/admin/stores?focus=${id}`);
  };

  const totalResults = searchResults.users.length + searchResults.stores.length;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: (t) => t.palette.mode === 'dark'
          ? 'rgba(17,24,39,0.92)'
          : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important', gap: 2 }}>
        {/* Mobile menu button */}
        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>

        {/* Page breadcrumb / brand */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: '0.05em' }}>
            RATESYNCPRO
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>/</Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.05em' }}>
            {user?.role === 'ADMIN' ? 'Administration' : user?.role === 'STORE_OWNER' ? 'Store Owner' : 'Customer Portal'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Global Search (Admin only) */}
        {user?.role === 'ADMIN' && (
          <Box ref={searchRef} sx={{ position: 'relative', width: { xs: '40%', sm: 320 } }}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                border: '1.5px solid',
                borderColor: showDrop ? 'primary.main' : 'divider',
                borderRadius: 2, px: 1.5, py: 0.6,
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: showDrop ? '0 0 0 3px rgba(79,106,240,0.12)' : 'none',
              }}
            >
              <SearchIcon sx={{ fontSize: 17, color: 'text.disabled', mr: 1 }} />
              <InputBase
                placeholder="Search users, stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery) setShowDrop(true); }}
                sx={{ fontSize: '0.875rem', flex: 1, '& input': { p: 0 } }}
              />
              {searchLoading && <CircularProgress size={14} sx={{ ml: 1 }} />}
              {searchQuery && !searchLoading && (
                <Typography variant="caption" sx={{ ml: 1, color: 'text.disabled', bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: 1, fontWeight: 600, fontSize: '0.65rem' }}>
                  ESC
                </Typography>
              )}
            </Box>

            {showDrop && (
              <Paper elevation={8} sx={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, borderRadius: 2.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider', zIndex: 2000 }}>
                {searchLoading ? (
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={20} /></Box>
                ) : totalResults === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>No results for "{searchQuery}"</Typography>
                  </Box>
                ) : (
                  <List dense sx={{ py: 0.5 }}>
                    {searchResults.users.length > 0 && (
                      <>
                        <Typography variant="overline" sx={{ px: 2, pt: 1.5, pb: 0.5, color: 'text.disabled', display: 'block' }}>Users</Typography>
                        {searchResults.users.map((u) => (
                          <ListItem button key={`u-${u.id}`} onClick={() => handleSearchClick('user', u.id)} sx={{ px: 2, py: 0.75, '&:hover': { bgcolor: 'action.hover' } }}>
                            <ListItemAvatar sx={{ minWidth: 34 }}>
                              <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: 'primary.main', fontWeight: 700 }}>
                                {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="body2" fontWeight={600}>{u.name}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{u.email} · {u.role}</Typography>} />
                          </ListItem>
                        ))}
                      </>
                    )}
                    {searchResults.users.length > 0 && searchResults.stores.length > 0 && <Divider />}
                    {searchResults.stores.length > 0 && (
                      <>
                        <Typography variant="overline" sx={{ px: 2, pt: 1.5, pb: 0.5, color: 'text.disabled', display: 'block' }}>Stores</Typography>
                        {searchResults.stores.map((s) => (
                          <ListItem button key={`s-${s.id}`} onClick={() => handleSearchClick('store', s.id)} sx={{ px: 2, py: 0.75, '&:hover': { bgcolor: 'action.hover' } }}>
                            <ListItemAvatar sx={{ minWidth: 34 }}>
                              <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: 'secondary.main', fontWeight: 700 }}>
                                <StorefrontOutlinedIcon sx={{ fontSize: 14 }} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="body2" fontWeight={600}>{s.name}</Typography>} secondary={<Typography variant="caption" color="text.secondary">★ {parseFloat(s.averageRating || 0).toFixed(1)}</Typography>} />
                          </ListItem>
                        ))}
                      </>
                    )}
                  </List>
                )}
              </Paper>
            )}
          </Box>
        )}

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={toggleThemeMode} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={0} color="error">
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, ml: 0.5,
              cursor: 'pointer', py: 0.5, px: 1.25, borderRadius: 2,
              border: '1.5px solid transparent',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'divider' },
              transition: 'all 0.2s',
            }}
          >
            <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', fontWeight: 700, background: `linear-gradient(135deg, ${roleColors[user?.role]}, ${roleColors[user?.role]}99)` }}>
              {user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'text.primary', display: 'block', lineHeight: 1.2 }}>
                {user?.name.split(' ').slice(0, 2).join(' ')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600 }}>
                {user?.role?.replace('_', ' ')}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </Box>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ elevation: 8, sx: { borderRadius: 2.5, border: '1px solid', borderColor: 'divider', minWidth: 220, mt: 1, overflow: 'visible' } }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={700}>{user?.name.split(' ').slice(0, 2).join(' ')}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>{user?.email}</Typography>
            <Chip label={user?.role?.replace('_', ' ')} size="small" sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: `${roleColors[user?.role]}18`, color: roleColors[user?.role] }} />
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ py: 1.25, gap: 1.5, mx: 0.5, borderRadius: 1.5, my: 0.5 }}>
            <ManageAccountsOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" fontWeight={600}>Account Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/login'); }} sx={{ py: 1.25, gap: 1.5, mx: 0.5, borderRadius: 1.5, my: 0.5, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
