import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import StarRateIcon from '@mui/icons-material/StarRate';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarIcon from '@mui/icons-material/Star';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import StoreReviewsDialog from '../../components/StoreReviewsDialog';

const hasUserRated = (store) => {
  if (!store || store.currentUserRating == null || store.currentUserRating === '') return false;
  const value = Number(store.currentUserRating);
  return Number.isFinite(value) && value >= 1 && value <= 5;
};

const getRatingColor = (r) => {
  if (r >= 4.5) return '#10B981';
  if (r >= 3.5) return '#0EA5E9';
  if (r >= 2.5) return '#F59E0B';
  return '#EF4444';
};

const Dashboard = () => {
  const { showNotification } = useNotification();

  // Query parameters for store list
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // 6 cards per page for grid beauty
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Rating Modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingVal, setRatingVal] = useState(0);
  const [commentVal, setCommentVal] = useState('');
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [openReviewsDialog, setOpenReviewsDialog] = useState(false);
  const [reviewsStore, setReviewsStore] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', {
        params: {
          page,
          limit,
          search,
          address: searchAddress,
          sortField,
          sortOrder
        }
      });
      setStores(res.data.data.stores);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      showNotification('Failed to load store list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, sortField, sortOrder]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchStores();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, searchAddress]);

  const handleOpenRatingDialog = (store) => {
    setSelectedStore(store);
    setRatingVal(store.currentUserRating ? parseInt(store.currentUserRating) : 5);
    setCommentVal(store.currentUserComment || '');
    setOpenRatingDialog(true);
  };

  const handleOpenReviewsDialog = (store) => {
    setReviewsStore(store);
    setOpenReviewsDialog(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;
    if (ratingVal < 1 || ratingVal > 5) {
      return showNotification('Rating must be between 1 and 5', 'error');
    }
    if (commentVal.length > 500) {
      return showNotification('Review comment cannot exceed 500 characters', 'error');
    }

    setSubmitLoading(true);
    try {
      const payload = { rating: ratingVal, comment: commentVal.trim() || null };
      const isUpdate = hasUserRated(selectedStore);
      if (isUpdate) {
        await api.put(`/ratings/${selectedStore.id}`, payload);
        showNotification('Thank you! Your review has been updated.', 'success');
      } else {
        await api.post('/ratings', { storeId: selectedStore.id, ...payload });
        showNotification('Thank you! Your review has been submitted.', 'success');
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setOpenRatingDialog(false);
      fetchStores();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Discover
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          Explore Outlets & Rate
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find registered business outlets, check overall ratings, and share your star score with a written review.
        </Typography>
      </Box>

      {/* Filter and Sort bar */}
      <Paper elevation={0} sx={{ mb: 4, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search by store name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search by address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort Stores By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={`${sortField}-${sortOrder}`}
                label="Sort Stores By"
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortField(field);
                  setSortOrder(order);
                }}
              >
                <MenuItem value="name-ASC">Store Name (A-Z)</MenuItem>
                <MenuItem value="name-DESC">Store Name (Z-A)</MenuItem>
                <MenuItem value="averageRating-DESC">Highest Rated First</MenuItem>
                <MenuItem value="averageRating-ASC">Lowest Rated First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Stores List Grid */}
      {loading ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Array(6).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rounded" height={60} />
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="rounded" width="30%" height={28} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stores.length > 0 ? (
              stores.map((store) => {
                const avgRating = parseFloat(store.averageRating || 0);
                const rColor = getRatingColor(avgRating);
                return (
                  <Grid item xs={12} sm={6} md={4} key={store.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px -4px rgba(79,106,240,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #4F6AF0, #0EA5E9)' }}>
                              {store.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.25 }}>
                              {store.name}
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={`★ ${avgRating.toFixed(1)}`} 
                            size="small" 
                            sx={{ 
                              fontWeight: 800, 
                              fontSize: '0.72rem',
                              bgcolor: alpha(rColor, 0.12),
                              color: rColor,
                              height: 22,
                              px: 0.5
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.5 }}>
                          {store.address}
                        </Typography>

                        <Divider />

                        {(store.totalRatings || 0) > 0 && (
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<ForumOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                            onClick={() => handleOpenReviewsDialog(store)}
                            sx={{ alignSelf: 'flex-start', fontWeight: 600, textTransform: 'none', px: 0, minWidth: 0 }}
                          >
                            View {store.totalRatings} Review{store.totalRatings !== 1 ? 's' : ''}
                          </Button>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                              Average Rating ({store.totalRatings || 0} reviews)
                            </Typography>
                            <Rating 
                              value={avgRating} 
                              readOnly 
                              precision={0.1} 
                              size="small"
                              sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
                            />
                          </Box>

                          <Box>
                            {hasUserRated(store) ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 140 }}>
                                <Typography variant="caption" color="success.main" fontWeight={700}>
                                  Your Rating: {store.currentUserRating} ★
                                </Typography>
                                {store.currentUserComment && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      mt: 0.5,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textAlign: 'right',
                                      lineHeight: 1.35,
                                      fontSize: '0.68rem'
                                    }}
                                  >
                                    "{store.currentUserComment}"
                                  </Typography>
                                )}
                                <Button
                                  variant="text"
                                  size="small"
                                  startIcon={<RateReviewIcon sx={{ fontSize: '13px !important' }} />}
                                  onClick={() => handleOpenRatingDialog(store)}
                                  sx={{ p: 0, mt: 0.5, fontWeight: 700, minWidth: 0, textTransform: 'none' }}
                                >
                                  Edit Review
                                </Button>
                              </Box>
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<StarRateIcon />}
                                onClick={() => handleOpenRatingDialog(store)}
                                sx={{ borderRadius: 2, fontWeight: 700 }}
                              >
                                Rate Store
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Box sx={{ py: 8, textAlign: 'center', border: '1.5px dashed', borderColor: 'divider', borderRadius: 2.5 }}>
                  <Typography color="text.secondary" fontWeight={600}>No stores match your search criteria.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Submit/Update Rating Dialog */}
      <Dialog
        open={openRatingDialog}
        onClose={() => setOpenRatingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, pt: 3 }}>
          {hasUserRated(selectedStore) ? 'Update Your Review' : 'Submit Store Review'}
        </DialogTitle>
        <Divider />
        <Box component="form" onSubmit={handleSubmitRating}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3.5 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={800}>
                {selectedStore?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Rate your experience and optionally share a written review.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Rating
                name="store-rating"
                value={ratingVal}
                onChange={(event, newValue) => { if (newValue >= 1) setRatingVal(newValue); }}
                size="large"
                sx={{ 
                  fontSize: '3.2rem',
                  '& .MuiRating-iconFilled': { color: '#F59E0B' } 
                }}
              />
              <Chip 
                label={`${ratingVal} / 5.0 Stars`} 
                color="primary" 
                sx={{ fontWeight: 800, fontSize: '0.9rem', px: 1, py: 0.5 }} 
              />
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              label="Write your review (optional)"
              placeholder="Share your experience — service, quality, ambiance..."
              value={commentVal}
              onChange={(e) => setCommentVal(e.target.value)}
              helperText={`${commentVal.length}/500 characters`}
              error={commentVal.length > 500}
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
            <Button onClick={() => setOpenRatingDialog(false)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitLoading}
              sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
            >
              {submitLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <StoreReviewsDialog
        open={openReviewsDialog}
        onClose={() => setOpenReviewsDialog(false)}
        storeId={reviewsStore?.id}
        storeName={reviewsStore?.name}
      />
    </Box>
  );
};

export default Dashboard;
