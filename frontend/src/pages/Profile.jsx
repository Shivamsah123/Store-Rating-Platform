import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import KeyIcon from '@mui/icons-material/Key';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };

const Profile = () => {
  const { user, changePassword } = useAuth();
  const { showNotification } = useNotification();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return showNotification('Passwords do not match', 'error');
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      return showNotification('Password must be between 8 and 16 characters long', 'error');
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasUppercase || !hasSpecial) {
      return showNotification('Password must contain at least 1 uppercase letter and at least 1 special character', 'error');
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Account settings
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          Security & Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account credentials, address information and security keys.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* User profile card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            {/* Top gradient card cap */}
            <Box sx={{ height: 110, background: `linear-gradient(135deg, ${roleColors[user?.role] || '#4F6AF0'}, ${roleColors[user?.role] || '#4F6AF0'}aa)` }} />
            <CardContent sx={{ p: 4, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  fontSize: '2rem',
                  fontWeight: 700,
                  mt: -5.5,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  background: `linear-gradient(135deg, ${roleColors[user?.role] || '#4F6AF0'}, ${roleColors[user?.role] || '#4F6AF0'}dd)`,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              >
                {user?.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </Avatar>

              <Typography variant="h5" fontWeight={800} sx={{ mt: 2, mb: 0.5 }}>
                {user?.name}
              </Typography>

              <Chip 
                label={user?.role.replace('_', ' ')} 
                size="small" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  color: roleColors[user?.role],
                  bgcolor: alpha(roleColors[user?.role] || '#4F6AF0', 0.12),
                  px: 1,
                  mb: 3
                }}
              />

              <Divider sx={{ width: '100%', mb: 3 }} />

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MailOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Email Address</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{user?.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOnOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20, mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Registered Address</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.5 }}>
                      {user?.address || 'No address registered'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change password card */}
        <Grid item xs={12} md={7}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main', display: 'flex' }}>
                  <KeyIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={800}>
                  Update Password
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 4, borderRadius: 2.5 }}>
                <Typography variant="caption" fontWeight={600}>
                  Password must be 8–16 characters long and contain at least 1 uppercase letter and 1 special character.
                </Typography>
              </Alert>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Current Password</Typography>
                    <TextField
                      required
                      fullWidth
                      name="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      id="currentPassword"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowCurrent(!showCurrent)} edge="end">
                            {showCurrent ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>New Password</Typography>
                    <TextField
                      required
                      fullWidth
                      name="newPassword"
                      type={showNew ? 'text' : 'password'}
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowNew(!showNew)} edge="end">
                            {showNew ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Confirm Password</Typography>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} edge="end">
                            {showConfirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 4, py: 1.5, fontWeight: 700 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Save New Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
