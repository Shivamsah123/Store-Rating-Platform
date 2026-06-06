import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarRateIcon from '@mui/icons-material/StarRate';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Paper elevation={4} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>
          {payload[0].value} {payload[0].value === 1 ? 'review' : 'reviews'}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storesLoading, setStoresLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerDashboardData = async () => {
      try {
        const res = await api.get('/store-owner/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load store owner stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDashboardData();
    // fetch owner's stores list
    const fetchStores = async () => {
      try {
        const res = await api.get('/store-owner/stores');
        setStores(res.data.data);
      } catch (error) {
        console.error('Failed to load owner stores:', error);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Formatting rating distribution for bar chart
  const getChartData = () => {
    if (!stats || !stats.distribution) return [];
    
    return [
      { rating: '5 Stars', count: stats.distribution[5] || 0, color: '#10B981' },
      { rating: '4 Stars', count: stats.distribution[4] || 0, color: '#34D399' },
      { rating: '3 Stars', count: stats.distribution[3] || 0, color: '#FCD34D' },
      { rating: '2 Stars', count: stats.distribution[2] || 0, color: '#F59E0B' },
      { rating: '1 Star', count: stats.distribution[1] || 0, color: '#EF4444' }
    ].reverse();
  };

  const chartData = getChartData();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Analytics
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          Business Performance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aggregated insights and feedback distribution across all stores owned by your account.
        </Typography>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            loading={loading}
            label="Average Rating"
            value={stats ? `${parseFloat(stats.averageRating).toFixed(1)} ★` : '0.0 ★'}
            sub="Across all outlets"
            icon={<StarRateIcon />}
            accent="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            loading={loading}
            label="Total Reviews"
            value={stats?.totalRatings || 0}
            sub="Customer responses"
            icon={<RateReviewIcon />}
            accent="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            loading={loading}
            label="Active Outlets"
            value={stats?.storesCount || 0}
            sub="Registered locations"
            icon={<StorefrontIcon />}
            accent="#0EA5E9"
          />
        </Grid>
      </Grid>

      {/* Owner's Stores List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Your Outlets</Typography>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          {storesLoading ? (
            <Skeleton variant="rectangular" height={72} />
          ) : stores.length > 0 ? (
            <List>
              {stores.map(s => (
                <ListItem key={s.id} disableGutters secondaryAction={
                  <Chip label={s.isActive ? 'Active' : 'Inactive'} size="small" color={s.isActive ? 'success' : 'default'} />
                }>
                  <ListItemText primary={s.name} secondary={s.address} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">You have no registered outlets yet.</Typography>
          )}
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Rating Breakdown Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, minHeight: 380 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha('#4F6AF0', 0.12), color: 'primary.main', display: 'flex' }}>
                <EqualizerIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>Reviews Score Distribution</Typography>
                <Typography variant="caption" color="text.secondary">Count of individual star ratings</Typography>
              </Box>
            </Box>
            
            {loading ? (
              <Skeleton variant="rounded" height={260} />
            ) : stats?.totalRatings > 0 ? (
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.1)" />
                    <XAxis type="number" tickLine={false} axisLine={false} style={{ fontSize: '0.75rem', fontWeight: 600 }} />
                    <YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} style={{ fontSize: '0.75rem', fontWeight: 700 }} />
                    <RTooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#4F6AF0" radius={[0, 4, 4, 0]} barSize={16}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 260, border: '1.5px dashed', borderColor: 'divider', borderRadius: 2 }}>
                <Typography color="text.secondary" fontWeight={600}>No ratings received yet to display distribution.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Visual score summary card */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 380 }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="circular" width={80} height={80} />
                <Skeleton variant="text" width="50%" height={24} />
                <Skeleton variant="rounded" width="80%" height={60} />
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1" fontWeight={800} color="text.secondary" sx={{ mb: 1.5 }}>
                  Overall Customer Score
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 2 }}>
                  <Typography variant="h1" fontWeight={900} color="primary.main" sx={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {stats ? parseFloat(stats.averageRating).toFixed(1) : '0.0'}
                  </Typography>
                  <Typography variant="h4" color="text.disabled" sx={{ ml: 1, fontWeight: 700 }}>
                    / 5.0
                  </Typography>
                </Box>
                
                <Rating 
                  value={stats ? parseFloat(stats.averageRating) : 0} 
                  precision={0.1} 
                  readOnly 
                  size="large" 
                  sx={{ 
                    fontSize: '2.5rem', 
                    mb: 3.5,
                    '& .MuiRating-iconFilled': { color: '#F59E0B' }
                  }} 
                />
                
                <Typography color="text.secondary" variant="body2" sx={{ px: 2, lineHeight: 1.65, fontWeight: 500 }}>
                  Based on <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{stats?.totalRatings || 0}</Box> customer reviews across your registered stores. Keep up the good work!
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
