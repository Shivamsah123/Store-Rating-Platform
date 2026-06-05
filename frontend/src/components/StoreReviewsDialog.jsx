import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const getRatingColor = (r) => {
  if (r >= 5) return '#10B981';
  if (r >= 4) return '#34D399';
  if (r >= 3) return '#FCD34D';
  if (r >= 2) return '#F59E0B';
  return '#EF4444';
};

const StoreReviewsDialog = ({ open, onClose, storeId, storeName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchReviews = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await api.get(`/stores/${storeId}/reviews`, { params: { page, limit } });
      setReviews(res.data.data.reviews || []);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, page]);

  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open, storeId]);

  useEffect(() => {
    if (open) fetchReviews();
  }, [open, fetchReviews]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pt: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={800}>Customer Reviews</Typography>
        <Typography variant="caption" color="text.secondary">{storeName}</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2.5, minHeight: 280 }}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} height={80} sx={{ mb: 2, borderRadius: 2 }} />
          ))
        ) : reviews.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => {
              const color = getRatingColor(review.rating);
              return (
                <Paper key={review.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.72rem', fontWeight: 700, bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main' }}>
                        {review.userName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{review.userName}</Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(review.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label={`★ ${review.rating}`} size="small" sx={{ height: 22, fontWeight: 800, bgcolor: alpha(color, 0.12), color }} />
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 1, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                  {review.comment ? (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55, fontStyle: 'italic' }}>
                      "{review.comment}"
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.disabled">No written review</Typography>
                  )}
                </Paper>
              );
            })}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <RateReviewOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>No reviews yet for this store</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoreReviewsDialog;
