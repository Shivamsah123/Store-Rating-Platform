import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const features = [
  'Real-time store performance analytics',
  'Role-based access control for teams',
  'Comprehensive audit trail & logging',
  'Actionable customer rating insights',
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Left Branding Panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '48%',
          minHeight: '100vh',
          background: 'linear-gradient(150deg, #1E2A4A 0%, #0F172A 60%, #0A0E1A 100%)',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,106,240,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,106,240,0.4)' }}>
            <StarIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: '-0.02em' }}>
            RateSync<Box component="span" sx={{ color: '#4F6AF0' }}>Pro</Box>
          </Typography>
        </Box>

        {/* Hero Text */}
        <Box>
          <Typography variant="overline" sx={{ color: '#4F6AF0', letterSpacing: '0.15em', mb: 2, display: 'block' }}>
            Enterprise Store Intelligence
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', mb: 3, lineHeight: 1.15 }}>
            Manage Stores.<br />Track Ratings.<br />
            <Box component="span" sx={{ background: 'linear-gradient(90deg, #4F6AF0, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Drive Growth.
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', mb: 5, maxWidth: 400, lineHeight: 1.75 }}>
            The all-in-one platform for enterprise store performance management, customer satisfaction tracking, and intelligent business analytics.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map((f) => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#4F6AF0', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom Stats */}
        <Box sx={{ display: 'flex', gap: 5 }}>
          {[['10K+', 'Stores'], ['500K+', 'Ratings'], ['99.9%', 'Uptime']].map(([val, label]) => (
            <Box key={label}>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>{val}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Login Panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 5, justifyContent: 'center' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StarIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>RateSync<Box component="span" sx={{ color: 'primary.main' }}>Pro</Box></Typography>
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            Sign in to your account to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth required id="email" name="email" autoComplete="email" autoFocus
                placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Password
              </Typography>
              <TextField
                fullWidth required name="password" type={showPassword ? 'text' : 'password'} id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 3, py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2.5, letterSpacing: '0.01em' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In to Dashboard'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" fontWeight={700} color="primary.main" underline="hover">
                Create free account
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" align="center" display="block">
              © 2024 RateSyncPro Inc. · Enterprise Store Intelligence Platform
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
