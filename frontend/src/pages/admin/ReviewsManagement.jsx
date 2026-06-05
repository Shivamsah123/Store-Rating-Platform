import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const getRatingColor = (r) => {
  if (r >= 5) return '#10B981';
  if (r >= 4) return '#34D399';
  if (r >= 3) return '#FCD34D';
  if (r >= 2) return '#F59E0B';
  return '#EF4444';
};

const ReviewsManagement = () => {
  const [ratings, setRatings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/ratings', { params: { page, limit, ...(search && { search }) } });
      setRatings(res.data.data.ratings || []);
      setTotal(res.data.data.pagination?.totalItems || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);
  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>Management</Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>Reviews</Typography>
        <Typography variant="body2" color="text.secondary">
          {total.toLocaleString()} customer ratings and written reviews across all stores
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <TextField
          placeholder="Search by customer, store, or review text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}
        />
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Written Review</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(5).fill(0).map((_, j) => <TableCell key={j}><Skeleton height={36} /></TableCell>)}
                </TableRow>
              )) : ratings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <RateReviewOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>No reviews found</Typography>
                  </TableCell>
                </TableRow>
              ) : ratings.map((row) => {
                const color = getRatingColor(row.rating);
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: '0.78rem', fontWeight: 700, bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main' }}>
                          {row.userName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{row.userName}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.userEmail}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{row.storeName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`★ ${row.rating}`} size="small" sx={{ height: 22, fontWeight: 800, bgcolor: alpha(color, 0.12), color }} />
                        <Rating value={row.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {row.comment ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.45 }}>
                          "{row.comment}"
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.disabled">No written review</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(row.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
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
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReviewsManagement;
