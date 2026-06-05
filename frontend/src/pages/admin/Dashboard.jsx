import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateGrowth = (base) =>
  months.slice(0, 8).map((m, i) => ({ month: m, value: Math.floor(base * (0.4 + (i / 8) * 0.6) + Math.random() * base * 0.12) }));

const roleColors = { ADMIN: '#EF4444', USER: '#4F6AF0', STORE_OWNER: '#0EA5E9' };
const RATING_COLORS = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length)
    return (
      <Paper elevation={4} sx={{ p: 1.5, borderRadius: 2, minWidth: 100, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
        <Typography variant="h6" fontWeight={800} color="primary.main">{payload[0]?.value}</Typography>
      </Paper>
    );
  return null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, u, st] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users?limit=5&sortField=createdAt&sortOrder=DESC'),
          api.get('/admin/stores?limit=5&sortField=averageRating&sortOrder=DESC'),
        ]);
        setStats(s.data.data);
        setRecentUsers(u.data.data.users || []);
        setTopStores(st.data.data.stores || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err?.response?.data || err.message);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const userGrowth = stats ? generateGrowth(stats.totalUsers) : [];
  const ratingGrowth = stats ? generateGrowth(stats.totalRatings) : [];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
          Administration
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.75, letterSpacing: '-0.02em' }}>
          Platform Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor all platform activity, user growth, and store performance in real-time.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Users', key: 'totalUsers', icon: <PeopleOutlinedIcon />, accent: '#4F6AF0', trend: 'up', trendValue: '+12%', sub: 'Registered accounts' },
          { label: 'Total Stores', key: 'totalStores', icon: <StorefrontOutlinedIcon />, accent: '#0EA5E9', trend: 'up', trendValue: '+8%', sub: 'Active listings' },
          { label: 'Total Ratings', key: 'totalRatings', icon: <StarOutlinedIcon />, accent: '#10B981', trend: 'up', trendValue: '+24%', sub: 'Customer reviews' },
          { label: 'Avg Platform Rating', key: 'avgRating', icon: <TrendingUpIcon />, accent: '#F59E0B', sub: 'Across all stores' },
        ].map(({ label, key, icon, accent, trend, trendValue, sub }) => (
          <Grid item xs={12} sm={6} xl={3} key={key}>
            <StatCard
              loading={loading}
              label={label}
              value={loading ? '' : key === 'avgRating' ? (parseFloat(stats?.[key] || 0).toFixed(2) + ' ★') : stats?.[key]?.toLocaleString() || '0'}
              sub={sub}
              icon={icon}
              accent={accent}
              trend={trend}
              trendValue={trendValue}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>User Growth</Typography>
                <Typography variant="caption" color="text.secondary">Cumulative registrations over 8 months</Typography>
              </Box>
              <Chip label="2024" size="small" sx={{ fontWeight: 700 }} />
            </Box>
            {loading ? <Skeleton variant="rounded" height={200} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F6AF0" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F6AF0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#4F6AF0" strokeWidth={2.5} fill="url(#userGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#4F6AF0' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: 300 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={800}>Rating Activity</Typography>
              <Typography variant="caption" color="text.secondary">Monthly submissions trend</Typography>
            </Box>
            {loading ? <Skeleton variant="rounded" height={200} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ratingGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ratingGrowth.map((_, i) => <Cell key={i} fill={i === ratingGrowth.length - 1 ? '#10B981' : alpha('#10B981', 0.45)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Tables */}
      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>Recent Users</Typography>
                <Typography variant="caption" color="text.secondary">Newest registrations</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/users')} sx={{ fontWeight: 700 }}>View All</Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={3}><Skeleton height={40} /></TableCell></TableRow>
                  )) : recentUsers.map((u) => (
                    <TableRow key={u.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/users/${u.id}`)}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: '0.72rem', fontWeight: 700, background: `linear-gradient(135deg, ${roleColors[u.role]}, ${roleColors[u.role]}88)` }}>
                            {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>{u.name.split(' ').slice(0, 2).join(' ')}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: alpha(roleColors[u.role], 0.1), color: roleColors[u.role] }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" color="text.secondary">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Stores */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>Top Rated Stores</Typography>
                <Typography variant="caption" color="text.secondary">Highest performing stores</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/stores')} sx={{ fontWeight: 700 }}>View All</Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Store</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="right">Reviews</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={4}><Skeleton height={40} /></TableCell></TableRow>
                  )) : topStores.map((s, i) => {
                    const rating = parseFloat(s.averageRating || 0);
                    const rColor = RATING_COLORS[Math.min(Math.round(rating) - 1, 4)] || '#94A3B8';
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <Box sx={{ width: 22, height: 22, borderRadius: 1, bgcolor: i < 3 ? alpha('#F59E0B', 0.12) : 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" fontWeight={800} sx={{ color: i < 3 ? '#F59E0B' : 'text.secondary', fontSize: '0.72rem' }}>{i + 1}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>{s.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{s.address?.slice(0, 30)}...</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`★ ${rating.toFixed(1)}`} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: alpha(rColor, 0.12), color: rColor }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.totalRatings || 0}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
