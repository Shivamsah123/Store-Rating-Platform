import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Password strength helpers (same as Register page)
const getPasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;
  return score;
};

const PasswordRule = ({ met, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    {met
      ? <CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} />
      : <RadioButtonUncheckedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />}
    <Typography variant="caption" sx={{ color: met ? 'success.main' : 'text.disabled', fontWeight: met ? 600 : 400, transition: 'color 0.2s', fontSize: '0.72rem' }}>
      {label}
    </Typography>
  </Box>
);

const ROLES = ['ALL', 'ADMIN', 'USER', 'STORE_OWNER'];
const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };
const COLS = [
  { id: 'name', label: 'User', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'role', label: 'Role', sortable: true },
  { id: 'address', label: 'Address', sortable: false },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'createdAt', label: 'Joined', sortable: true },
  { id: 'actions', label: '', sortable: false },
];

const defaultForm = { name: '', email: '', password: '', address: '', role: 'USER' };

const UsersManagement = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const limit = 10;

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive });
      showNotification(`User account has been ${isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchUsers();
    } catch (e) {
      showNotification(e.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    try {
      await api.delete(`/admin/users/${confirmDeleteUser.id}`);
      showNotification('User deleted successfully!', 'success');
      setConfirmDeleteUser(null);
      fetchUsers();
    } catch (e) {
      showNotification(e.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, sortOrder, ...(search && { search }), ...(roleFilter !== 'ALL' && { role: roleFilter }) };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.data.users || []);
      setTotal(res.data.data.pagination?.totalItems || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, roleFilter, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleSort = (col) => {
    if (sortBy === col) setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(col); setSortOrder('ASC'); }
  };

  const handleAddUser = async () => {
    // Frontend validations
    if (!form.name.trim()) {
      return showNotification('Full Name is required', 'error');
    }
    if (form.name.length < 20 || form.name.length > 60) {
      return showNotification('Name must be 20–60 characters', 'error');
    }
    if (!form.email.trim()) {
      return showNotification('Email is required', 'error');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return showNotification('A valid email address is required', 'error');
    }
    if (!form.role) {
      return showNotification('Role is required', 'error');
    }
    if (!form.password) {
      return showNotification('Password is required', 'error');
    }
    if (form.password.length < 8 || form.password.length > 16) {
      return showNotification('Password must be 8–16 characters', 'error');
    }
    if (!/[A-Z]/.test(form.password)) {
      return showNotification('Password needs at least 1 uppercase letter', 'error');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      return showNotification('Password needs at least 1 special character', 'error');
    }
    if (!form.address.trim()) {
      return showNotification('Address is required', 'error');
    }
    if (form.address.length > 400) {
      return showNotification('Address cannot exceed 400 characters', 'error');
    }

    setSubmitting(true);
    try {
      await api.post('/admin/users', form);
      showNotification('User created successfully!', 'success');
      setOpenDialog(false);
      setForm(defaultForm);
      fetchUsers();
    } catch (e) {
      if (e.response?.data?.errors && Array.isArray(e.response.data.errors)) {
        showNotification(e.response.data.errors.join(', '), 'error');
      } else {
        showNotification(e.response?.data?.message || 'Failed to create user', 'error');
      }
    } finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>Management</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>Users</Typography>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} registered accounts on the platform
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<PersonAddOutlinedIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1.25, boxShadow: '0 4px 14px rgba(79,106,240,0.35)' }}
        >
          Add User
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            size="small" sx={{ flex: 1, minWidth: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} size="small" sx={{ minWidth: 140 }}>
              {ROLES.map((r) => <MenuItem key={r} value={r} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{r === 'ALL' ? 'All Roles' : r}</MenuItem>)}
            </Select>
          </Box>
          {(search || roleFilter !== 'ALL') && (
            <Button size="small" onClick={() => { setSearch(''); setRoleFilter('ALL'); }} sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Clear filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {COLS.map((col) => (
                  <TableCell key={col.id} align={col.id === 'actions' ? 'right' : 'left'}>
                    {col.sortable ? (
                      <TableSortLabel active={sortBy === col.id} direction={sortBy === col.id ? sortOrder.toLowerCase() : 'asc'} onClick={() => handleSort(col.id)}>
                        {col.label}
                      </TableSortLabel>
                    ) : col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {COLS.map((c) => <TableCell key={c.id}><Skeleton height={36} /></TableCell>)}
                </TableRow>
              )) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLS.length} align="center" sx={{ py: 8 }}>
                    <PeopleOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>No users found</Typography>
                    <Typography variant="caption" color="text.disabled">Try adjusting your search or filters</Typography>
                  </TableCell>
                </TableRow>
              ) : users.map((u) => (
                <TableRow key={u.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/users/${u.id}`)}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: '0.78rem', fontWeight: 700, background: `linear-gradient(135deg, ${roleColors[u.role]}, ${roleColors[u.role]}88)` }}>
                        {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>ID: #{u.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                  <TableCell>
                    <Chip label={u.role} size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: alpha(roleColors[u.role], 0.1), color: roleColors[u.role] }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.address || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={u.isActive ? "Active" : "Not Active"} 
                      size="small" 
                      sx={{ 
                        height: 22, 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        bgcolor: alpha(u.isActive ? '#10B981' : '#EF4444', 0.1), 
                        color: u.isActive ? '#10B981' : '#EF4444' 
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title={u.isActive ? "Deactivate User" : "Activate User"}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleUserStatus(u.id, !u.isActive)}
                          sx={{ 
                            color: u.isActive ? 'warning.main' : 'success.main', 
                            bgcolor: alpha(u.isActive ? '#ED6C02' : '#2E7D32', 0.06), 
                            '&:hover': { bgcolor: alpha(u.isActive ? '#ED6C02' : '#2E7D32', 0.15) } 
                          }}
                        >
                          {u.isActive ? <BlockIcon sx={{ fontSize: 16 }} /> : <CheckIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => navigate(`/admin/users/${u.id}`)} sx={{ color: 'primary.main', bgcolor: alpha('#4F6AF0', 0.06), '&:hover': { bgcolor: alpha('#4F6AF0', 0.15) } }}>
                          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete User">
                        <IconButton 
                          size="small" 
                          onClick={() => setConfirmDeleteUser(u)}
                          sx={{ 
                            color: 'error.main', 
                            bgcolor: alpha('#D32F2F', 0.06), 
                            '&:hover': { bgcolor: alpha('#D32F2F', 0.15) } 
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total} users
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
          </Box>
        )}
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pt: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>Add New User</Typography>
          <Typography variant="caption" color="text.secondary">Create a new platform user account</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {/* Info Alert explaining requirements */}
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }}>
            <Typography variant="caption" fontWeight={600} display="block">
              • Full name must be 20–60 characters (e.g., "Johnathan Michael Robertson")
            </Typography>
            <Typography variant="caption" fontWeight={600} display="block" sx={{ mt: 0.5 }}>
              • Password must be 8–16 characters, with 1 uppercase and 1 special character
            </Typography>
          </Alert>

          <Grid container spacing={2.5}>

            {/* Full Name with character counter */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Full Name *</Typography>
              <TextField
                fullWidth
                placeholder="e.g., Johnathan Michael Robertson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                helperText={
                  <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{form.name.length < 20 ? `${20 - form.name.length} more characters needed` : '✓ Valid length'}</span>
                    <span style={{ color: form.name.length >= 20 && form.name.length <= 60 ? '#10B981' : '#EF4444' }}>{form.name.length}/60</span>
                  </Box>
                }
                error={form.name.length > 0 && (form.name.length < 20 || form.name.length > 60)}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email *</Typography>
              <TextField fullWidth placeholder="user@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Role *</Typography>
              <Select fullWidth value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {['ADMIN', 'USER', 'STORE_OWNER'].map((r) => <MenuItem key={r} value={r} sx={{ fontWeight: 600 }}>{r}</MenuItem>)}
              </Select>
            </Grid>

            {/* Password with strength meter */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password *</Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="8–16 chars, 1 uppercase, 1 special"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {/* Strength meter + Rules — same as Register page */}
              {(() => {
                const strength = getPasswordStrength(form.password);
                const strengthColor = ['error', 'error', 'warning', 'info', 'success'][strength];
                const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
                return (
                  <Box sx={{ mt: 1.5 }}>
                    {form.password && (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Password strength</Typography>
                          <Typography variant="caption" fontWeight={700} color={`${strengthColor}.main`}>{strengthLabel}</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={(strength / 4) * 100} color={strengthColor} sx={{ mb: 1.5 }} />
                      </>
                    )}
                    <Box sx={{ mt: form.password ? 0 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                      <PasswordRule met={form.password.length >= 8} label="8+ characters" />
                      <PasswordRule met={form.password.length <= 16} label="Max 16 chars" />
                      <PasswordRule met={/[A-Z]/.test(form.password)} label="1 uppercase letter" />
                      <PasswordRule met={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(form.password)} label="1 special character" />
                    </Box>
                  </Box>
                );
              })()}
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Address</Typography>
              <TextField
                fullWidth
                placeholder="Street address, city..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                helperText={`${form.address.length}/400 characters`}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" disabled={submitting} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={Boolean(confirmDeleteUser)} onClose={() => setConfirmDeleteUser(null)}>
        <DialogTitle sx={{ pt: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>Confirm Delete</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete user <strong>{confirmDeleteUser?.name}</strong>?
          </Typography>
          {confirmDeleteUser?.role === 'STORE_OWNER' && (
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
              ⚠️ WARNING: This user is a Store Owner. Deleting this account will cascadingly delete all their stores and reviews!
            </Typography>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <Button onClick={() => setConfirmDeleteUser(null)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
