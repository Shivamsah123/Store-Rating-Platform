import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const StatCard = ({ icon, label, value, sub, trend, trendValue, accent = '#4F6AF0', loading = false }) => {
  const TrendIcon = trend === 'up' ? TrendingUpIcon : trend === 'down' ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#94A3B8';

  if (loading) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 1.5, mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="45%" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (t) => `0 12px 32px -8px ${alpha(accent, 0.18)}`,
        },
      }}
    >
      {/* Background accent bar */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${alpha(accent, 0.3)})` }} />

      {/* Subtle bg glow */}
      <Box sx={{ position: 'absolute', top: 10, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(accent, 0.08)} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Box
          sx={{
            width: 46, height: 46, borderRadius: 2,
            background: alpha(accent, 0.12),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accent,
            border: `1px solid ${alpha(accent, 0.2)}`,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 22, color: accent } })}
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 0.4, px: 1, borderRadius: 2, bgcolor: alpha(trendColor, 0.1) }}>
            <TrendIcon sx={{ fontSize: 14, color: trendColor }} />
            {trendValue && <Typography variant="caption" sx={{ fontWeight: 700, color: trendColor, fontSize: '0.72rem' }}>{trendValue}</Typography>}
          </Box>
        )}
      </Box>

      <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ color: 'text.secondary', mb: sub ? 0.5 : 0 }}>
        {label}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
};

export default StatCard;
