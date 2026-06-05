import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const getPasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;
  return score;
};

const PasswordRule = ({ met, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {met ? (
      <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
    ) : (
      <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
    )}
    <Typography variant="caption" sx={{ color: met ? 'success.main' : 'text.disabled', fontWeight: met ? 600 : 400, transition: 'color 0.2s' }}>
      {label}
    </Typography>
  </Box>
);

const Register = () => {
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const pwdStrength = getPasswordStrength(form.password);
  const strengthColor = ['error', 'error', 'warning', 'info', 'success'][pwdStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwdStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.length < 20 || form.name.length > 60) return showNotification('Name must be 20–60 characters', 'error');
    if (form.address.length > 400) return showNotification('Address cannot exceed 400 characters', 'error');
    if (form.password !== form.confirmPassword) return showNotification('Passwords do not match', 'error');
    if (form.password.length < 8 || form.password.length > 16) return showNotification('Password must be 8–16 characters', 'error');
    if (!/[A-Z]/.test(form.password)) return showNotification('Password needs at least 1 uppercase letter', 'error');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) return showNotification('Password needs at least 1 special character', 'error');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.address);
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
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          width: '42%',
          background: 'linear-gradient(150deg, #1E2A4A 0%, #0F172A 60%, #0A0E1A 100%)',
          p: 7,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,106,240,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 7 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,106,240,0.4)' }}>
            <StarIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>
            RateSync<Box component="span" sx={{ color: '#4F6AF0' }}>Pro</Box>
          </Typography>
        </Box>
        <Typography variant="overline" sx={{ color: '#4F6AF0', letterSpacing: '0.15em', mb: 2, display: 'block' }}>
          Join our network
        </Typography>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mb: 3, lineHeight: 1.2 }}>
          Start rating stores<br />
          <Box component="span" sx={{ background: 'linear-gradient(90deg, #4F6AF0, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            in minutes.
          </Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 360 }}>
          Create your account and become part of the largest store rating network. Share your experience and help businesses improve.
        </Typography>
        <Box sx={{ mt: 6, p: 3, borderRadius: 3, background: 'rgba(79,106,240,0.1)', border: '1px solid rgba(79,106,240,0.2)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', mb: 2, lineHeight: 1.7 }}>
            "RateSyncPro transformed how we collect and act on customer feedback. Our satisfaction scores improved by 40% in 3 months."
          </Typography>
          <Typography variant="caption" sx={{ color: '#4F6AF0', fontWeight: 700 }}>— Sarah Chen, Operations Director</Typography>
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 }, overflowY: 'auto' }}>
        <Box sx={{ width: '100%', maxWidth: 500, py: 3 }}>
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 5, justifyContent: 'center' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StarIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>RateSync<Box component="span" sx={{ color: 'primary.main' }}>Pro</Box></Typography>
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight={700} color="primary.main" underline="hover">Sign in here</Link>
          </Typography>

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }}>
            <Typography variant="caption" fontWeight={600}>
              Full name must be 20–60 characters (e.g., "Johnathan Michael Robertson")
            </Typography>
          </Alert>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Full Name *</Typography>
                <TextField
                  fullWidth required placeholder="e.g., Johnathan Michael Robertson"
                  value={form.name} onChange={set('name')}
                  helperText={`${form.name.length}/60 characters ${form.name.length < 20 ? '(minimum 20)' : '✓'}`}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email Address *</Typography>
                <TextField
                  fullWidth required type="email" placeholder="you@company.com"
                  value={form.email} onChange={set('email')}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Physical Address *</Typography>
                <TextField
                  fullWidth required multiline rows={2} placeholder="Street address, city, state..."
                  value={form.address} onChange={set('address')}
                  helperText={`${form.address.length}/400 characters`}
                  InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: -1.5, alignSelf: 'flex-start', pt: 1.5 }}><LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password *</Typography>
                <TextField
                  fullWidth required type={showPassword ? 'text' : 'password'} placeholder="Create strong password"
                  value={form.password} onChange={set('password')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton></InputAdornment>,
                  }}
                />
                {form.password && (
                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Password strength</Typography>
                      <Typography variant="caption" fontWeight={700} color={`${strengthColor}.main`}>{strengthLabel}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(pwdStrength / 4) * 100} color={strengthColor} />
                    <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                      <PasswordRule met={form.password.length >= 8} label="8+ characters" />
                      <PasswordRule met={form.password.length <= 16} label="Max 16 chars" />
                      <PasswordRule met={/[A-Z]/.test(form.password)} label="1 uppercase letter" />
                      <PasswordRule met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)} label="1 special character" />
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Confirm Password *</Typography>
                <TextField
                  fullWidth required type="password" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={set('confirmPassword')}
                  error={form.confirmPassword.length > 0 && form.password !== form.confirmPassword}
                  helperText={form.confirmPassword.length > 0 && form.password !== form.confirmPassword ? 'Passwords do not match' : ''}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ mt: 4, mb: 2, py: 1.6, fontSize: '1rem', fontWeight: 700, borderRadius: 2.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account →'}
            </Button>

            <Typography variant="caption" color="text.disabled" align="center" display="block" sx={{ mt: 2, lineHeight: 1.7 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
