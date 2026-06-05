import React, { useEffect, useState, useCallback } from 'react';
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import StarIcon from '@mui/icons-material/Star';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import StoreReviewsDialog from '../../components/StoreReviewsDialog';

const COLS = [
  { id: 'name', label: 'Store', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'address', label: 'Address', sortable: false },
  { id: 'owner', label: 'Owner', sortable: false },
  { id: 'averageRating', label: 'Rating', sortable: true },
  { id: 'totalRatings', label: 'Reviews', sortable: true },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'actions', label: '', sortable: false },
];

const getRatingColor = (r) => {
  if (r >= 4.5) return '#10B981';
  if (r >= 3.5) return '#0EA5E9';
  if (r >= 2.5) return '#F59E0B';
  return '#EF4444';
};

const defaultForm = { name: '', email: '', address: '', ownerId: '' };

const StoresManagement = () => {
  const { showNotification } = useNotification();
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('averageRating');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteStore, setConfirmDeleteStore] = useState(null);
  const [reviewsStore, setReviewsStore] = useState(null);
  const limit = 10;

  const handleToggleStoreStatus = async (storeId, isActive) => {
    try {
      await api.patch(`/admin/stores/${storeId}/status`, { isActive });
      showNotification(`Store has been ${isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchStores();
    } catch (e) {
      showNotification(e.response?.data?.message || 'Failed to update store status', 'error');
    }
  };

  const handleDeleteStore = async () => {
    if (!confirmDeleteStore) return;
    try {
      await api.delete(`/admin/stores/${confirmDeleteStore.id}`);
      showNotification('Store deleted successfully!', 'success');
      setConfirmDeleteStore(null);
      fetchStores();
    } catch (e) {
      showNotification(e.response?.data?.message || 'Failed to delete store', 'error');
    }
  };

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, sortOrder, ...(search && { search }) };
      const res = await api.get('/admin/stores', { params });
      setStores(res.data.data.stores || []);
      setTotal(res.data.data.pagination?.totalItems || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, sortBy, sortOrder]);

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER', limit: 100 } });
      setOwners(res.data.data.users || []);
    } catch {}
  };

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSort = (col) => {
    if (sortBy === col) setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(col); setSortOrder('ASC'); }
  };

  const handleOpenDialog = () => { fetchOwners(); setOpenDialog(true); };

  const handleAddStore = async () => {
    setSubmitting(true);
    try {
      await api.post('/admin/stores', form);
      showNotification('Store created successfully!', 'success');
      setOpenDialog(false);
      setForm(defaultForm);
      fetchStores();
    } catch (e) {
      showNotification(e.response?.data?.message || 'Failed to create store', 'error');
    } finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>Management</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>Stores</Typography>
          <Typography variant="body2" color="text.secondary">{total.toLocaleString()} registered stores on the platform</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<AddBusinessOutlinedIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1.25, boxShadow: '0 4px 14px rgba(79,106,240,0.35)' }}
        >
          Add Store
        </Button>
      </Box>

      {/* Search */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search stores by name or address..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            size="small" sx={{ flex: 1, minWidth: 260 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}
          />
          {search && (
            <Button size="small" onClick={() => setSearch('')} sx={{ fontWeight: 600, color: 'text.secondary' }}>Clear</Button>
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
              )) : stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLS.length} align="center" sx={{ py: 8 }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>No stores found</Typography>
                  </TableCell>
                </TableRow>
              ) : stores.map((s) => {
                const rating = parseFloat(s.averageRating || 0);
                const rColor = getRatingColor(rating);
                return (
                  <TableRow key={s.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
                          {s.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{s.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>ID: #{s.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{s.email}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{s.owner?.name?.split(' ').slice(0, 2).join(' ') || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`★ ${rating.toFixed(1)}`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, bgcolor: alpha(rColor, 0.12), color: rColor }} />
                        <Box sx={{ width: 60 }}>
                          <LinearProgress variant="determinate" value={(rating / 5) * 100} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(rColor, 0.15), '& .MuiLinearProgress-bar': { bgcolor: rColor, borderRadius: 2 } }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                        <Typography variant="body2" fontWeight={600}>{s.totalRatings || 0}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={s.isActive ? "Active" : "Not Active"} 
                        size="small" 
                        sx={{ 
                          height: 22, 
                          fontSize: '0.68rem', 
                          fontWeight: 700, 
                          bgcolor: alpha(s.isActive ? '#10B981' : '#EF4444', 0.1), 
                          color: s.isActive ? '#10B981' : '#EF4444' 
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title={s.isActive ? "Deactivate Store" : "Activate Store"}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleStoreStatus(s.id, !s.isActive)}
                            sx={{ 
                              color: s.isActive ? 'warning.main' : 'success.main', 
                              bgcolor: alpha(s.isActive ? '#ED6C02' : '#2E7D32', 0.06), 
                              '&:hover': { bgcolor: alpha(s.isActive ? '#ED6C02' : '#2E7D32', 0.15) } 
                            }}
                          >
                            {s.isActive ? <BlockIcon sx={{ fontSize: 16 }} /> : <CheckIcon sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View Reviews">
                          <IconButton
                            size="small"
                            onClick={() => setReviewsStore(s)}
                            sx={{
                              color: 'info.main',
                              bgcolor: alpha('#0288D1', 0.06),
                              '&:hover': { bgcolor: alpha('#0288D1', 0.15) }
                            }}
                          >
                            <ForumOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Store">
                          <IconButton 
                            size="small" 
                            onClick={() => setConfirmDeleteStore(s)}
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total} stores
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
          </Box>
        )}
      </Paper>

      {/* Add Store Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pt: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>Add New Store</Typography>
          <Typography variant="caption" color="text.secondary">Register a new store on the platform</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Store Name *</Typography>
              <TextField fullWidth placeholder="e.g., Downtown Coffee Shop" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Business Email *</Typography>
              <TextField fullWidth type="email" placeholder="store@business.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Store Owner *</Typography>
              <Select fullWidth value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} displayEmpty>
                <MenuItem value="" disabled><Typography color="text.disabled" variant="body2">Select Owner</Typography></MenuItem>
                {owners.map((o) => <MenuItem key={o.id} value={o.id} sx={{ fontWeight: 600 }}>{o.name}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Store Address *</Typography>
              <TextField fullWidth multiline rows={2} placeholder="Full store address..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleAddStore} variant="contained" disabled={submitting} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
            {submitting ? 'Creating...' : 'Create Store'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={Boolean(confirmDeleteStore)} onClose={() => setConfirmDeleteStore(null)}>
        <DialogTitle sx={{ pt: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>Confirm Delete</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete store <strong>{confirmDeleteStore?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
            ⚠️ WARNING: Deleting this store will cascadingly delete all ratings/reviews associated with it!
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <Button onClick={() => setConfirmDeleteStore(null)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDeleteStore} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      <StoreReviewsDialog
        open={Boolean(reviewsStore)}
        onClose={() => setReviewsStore(null)}
        storeId={reviewsStore?.id}
        storeName={reviewsStore?.name}
      />
    </Box>
  );
};

export default StoresManagement;
