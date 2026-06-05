import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import StoreReviewsDialog from '../../components/StoreReviewsDialog';

const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsStore, setReviewsStore] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUserDetail(res.data.data.user);
      } catch (error) {
        showNotification('Failed to load user details', 'error');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetail) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">User not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/users')}
        variant="outlined"
        sx={{ mb: 4, borderRadius: 2 }}
      >
        Back to Users List
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Management
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          User Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed overview of user account parameters and associations.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ height: 110, background: `linear-gradient(135deg, ${roleColors[userDetail.role]}, ${roleColors[userDetail.role]}aa)` }} />
            <CardContent sx={{ p: 4, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 90, 
                  height: 90, 
                  mt: -5.5,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  background: `linear-gradient(135deg, ${roleColors[userDetail.role]}, ${roleColors[userDetail.role]}dd)`,
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                {userDetail.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </Avatar>
              
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>
                  {userDetail.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  ID: #{userDetail.id}
                </Typography>
                <Chip 
                  label={userDetail.role.replace('_', ' ')} 
                  size="small" 
                  sx={{ 
                    mt: 1.5,
                    fontWeight: 700, 
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    color: roleColors[userDetail.role],
                    bgcolor: alpha(roleColors[userDetail.role], 0.12),
                    px: 1
                  }}
                />
              </Box>

              <Divider sx={{ width: '100%', mb: 3 }} />

              <Box sx={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MailOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Email Address</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{userDetail.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOnOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20, mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Physical Address</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.5 }}>
                      {userDetail.address || '—'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarTodayOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Registration Date</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {new Date(userDetail.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Association Card */}
        <Grid item xs={12} md={7}>
          {userDetail.role === 'USER' ? (
            <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main', display: 'flex' }}>
                    <RateReviewOutlinedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={800}>Submitted Reviews</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  All store ratings and written reviews submitted by this customer.
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {userDetail.ratings && userDetail.ratings.length > 0 ? (
                  userDetail.ratings.map((review) => (
                    <Paper key={review.id} elevation={0} sx={{ p: 2.5, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800}>{review.storeName}</Typography>
                          <Typography variant="caption" color="text.secondary">{review.storeAddress}</Typography>
                        </Box>
                        <Chip label={`★ ${review.rating}`} size="small" sx={{ fontWeight: 800, bgcolor: alpha('#F59E0B', 0.12), color: '#F59E0B' }} />
                      </Box>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                      {review.comment ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.55 }}>
                          "{review.comment}"
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.disabled">No written review</Typography>
                      )}
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5 }}>
                        Submitted {new Date(review.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                        {review.updatedAt !== review.createdAt && ' · Updated later'}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center', border: '1.5px dashed', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography color="text.secondary" fontWeight={600}>This user has not submitted any reviews yet.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : userDetail.role === 'STORE_OWNER' ? (
            <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha('#0EA5E9', 0.12), color: 'secondary.main', display: 'flex' }}>
                    <StorefrontIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    Owned Stores
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Stores managed by this owner and their aggregated ratings.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {userDetail.stores && userDetail.stores.length > 0 ? (
                  userDetail.stores.map((store) => (
                    <Paper 
                      key={store.id} 
                      elevation={0}
                      sx={{ 
                        p: 2.5, 
                        mb: 2, 
                        borderRadius: 2, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {store.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={parseFloat(store.averageRating || 0)} readOnly precision={0.1} size="small" />
                          <Typography variant="body2" fontWeight={800} color="text.primary">
                            {parseFloat(store.averageRating || 0).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {store.address}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>REVIEWS</Typography>
                          <Typography variant="body2" fontWeight={700} color="text.primary">{store.totalRatings || 0}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>STORE ID</Typography>
                          <Typography variant="body2" fontWeight={700} color="text.primary">#{store.id}</Typography>
                        </Box>
                        {(store.totalRatings || 0) > 0 && (
                          <Button
                            size="small"
                            startIcon={<ForumOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                            onClick={() => setReviewsStore(store)}
                            sx={{ ml: 'auto', fontWeight: 700, textTransform: 'none' }}
                          >
                            View Reviews
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center', border: '1.5px dashed', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography color="text.secondary" fontWeight={600}>This owner has no stores registered yet.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
              <Box>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
                  <BusinessCenterOutlinedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                  No Associated Business Entities
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: 'auto', lineHeight: 1.6 }}>
                  Stores are only associated with users containing the Store Owner system role.
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
      <StoreReviewsDialog
        open={Boolean(reviewsStore)}
        onClose={() => setReviewsStore(null)}
        storeId={reviewsStore?.id}
        storeName={reviewsStore?.name}
      />
    </Container>
  );
};

export default UserDetails;
