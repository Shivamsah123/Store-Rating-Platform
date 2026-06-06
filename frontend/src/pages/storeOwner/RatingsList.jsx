import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const getRatingColor = (r) => {
  if (r >= 5) return '#10B981';
  if (r >= 4) return '#34D399';
  if (r >= 3) return '#FCD34D';
  if (r >= 2) return '#F59E0B';
  return '#EF4444';
};

const RatingsList = () => {
  const { showNotification } = useNotification();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortValue, setSortValue] = useState('createdAt:DESC');

  useEffect(() => {
    const fetchRatingsList = async (opts = {}) => {
      try {
        setLoading(true);
        const params = {
          search: opts.search ?? search,
          rating: opts.rating ?? ratingFilter
        };
        const [field, order] = (opts.sortValue ?? sortValue).split(':');
        params.sortField = field;
        params.sortOrder = order;

        const res = await api.get('/store-owner/ratings', { params });
        setRatings(res.data.data);
      } catch (error) {
        showNotification('Failed to load ratings list', 'error');
      } finally {
        setLoading(false);
      }
    };

    // initial load
    fetchRatingsList({ search, rating: ratingFilter, sortValue });

    // expose for manual search/button
    RatingsList.fetch = fetchRatingsList;
  }, []);

  const handleSearch = () => {
    const fetch = RatingsList.fetch;
    if (fetch) fetch({ search, rating: ratingFilter, sortValue });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Reviews
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          Customer Feedback
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed list of all ratings and scores submitted by customers for your store outlets.
        </Typography>
      </Box>

      {/* Table Container */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField size="small" label="Search by company" value={search} onChange={(e) => setSearch(e.target.value)} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select label="Rating" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="1">1</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort</InputLabel>
              <Select label="Sort" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
                <MenuItem value="createdAt:DESC">Date (newest)</MenuItem>
                <MenuItem value="createdAt:ASC">Date (oldest)</MenuItem>
                <MenuItem value="rating:DESC">Rating (high → low)</MenuItem>
                <MenuItem value="rating:ASC">Rating (low → high)</MenuItem>
                <MenuItem value="storeName:ASC">Store (A → Z)</MenuItem>
                <MenuItem value="storeName:DESC">Store (Z → A)</MenuItem>
              </Select>
            </FormControl>
            <IconButton size="small" onClick={handleSearch} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Stack>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Store Rated</TableCell>
                <TableCell>Score Value</TableCell>
                <TableCell>Written Review</TableCell>
                <TableCell align="right">Date Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton height={40} /></TableCell>
                    <TableCell><Skeleton height={40} /></TableCell>
                    <TableCell><Skeleton height={40} /></TableCell>
                    <TableCell><Skeleton height={40} /></TableCell>
                    <TableCell align="right"><Skeleton height={40} /></TableCell>
                  </TableRow>
                ))
              ) : ratings.length > 0 ? (
                ratings.map((row) => {
                  const ratingVal = parseFloat(row.rating);
                  const color = getRatingColor(ratingVal);
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main', width: 34, height: 34, fontSize: '0.78rem', fontWeight: 700 }}>
                            {row.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {row.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {row.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {row.storeName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`★ ${ratingVal.toFixed(1)}`} 
                            size="small" 
                            sx={{ 
                              height: 22, 
                              fontSize: '0.7rem', 
                              fontWeight: 800, 
                              bgcolor: alpha(color, 0.12), 
                              color: color 
                            }} 
                          />
                          <Rating 
                            value={ratingVal} 
                            readOnly 
                            size="small" 
                            sx={{ 
                              fontSize: '0.95rem',
                              '& .MuiRating-iconFilled': { color: '#F59E0B' } 
                            }} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        {row.comment ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.45,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontStyle: 'italic'
                            }}
                          >
                            "{row.comment}"
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.disabled" fontWeight={500}>
                            No written review
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {new Date(row.createdAt).toLocaleDateString([], { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <RateReviewOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>No ratings received yet</Typography>
                    <Typography variant="caption" color="text.disabled">Customer reviews will appear here when submitted</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RatingsList;
