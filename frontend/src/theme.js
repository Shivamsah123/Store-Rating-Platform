import { createTheme, alpha } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#4F6AF0',
        light: '#7B93F5',
        dark: '#3451CC',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0EA5E9',
        light: '#38BDF8',
        dark: '#0284C7',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      warning: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      background: {
        default: isDark ? '#0A0E1A' : '#F0F4FF',
        paper: isDark ? '#111827' : '#FFFFFF',
        sidebar: isDark ? '#060B17' : '#1E2A4A',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#475569',
        disabled: isDark ? '#475569' : '#94A3B8',
      },
      divider: isDark ? alpha('#4F6AF0', 0.12) : alpha('#1E2A4A', 0.08),
      action: {
        hover: isDark ? alpha('#4F6AF0', 0.08) : alpha('#4F6AF0', 0.05),
        selected: isDark ? alpha('#4F6AF0', 0.15) : alpha('#4F6AF0', 0.1),
      },
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, fontSize: '2.75rem', letterSpacing: '-0.02em', lineHeight: 1.2 },
      h2: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.015em', lineHeight: 1.25 },
      h3: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.01em' },
      h4: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
      h5: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.005em' },
      h6: { fontWeight: 600, fontSize: '1.0625rem' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
      body2: { fontSize: '0.875rem', lineHeight: 1.57 },
      caption: { fontSize: '0.75rem', letterSpacing: '0.02em' },
      overline: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em' },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 10 },
    shadows: [
      'none',
      isDark
        ? '0 1px 2px 0 rgba(0,0,0,0.6)'
        : '0 1px 2px 0 rgba(15,23,42,0.06)',
      isDark
        ? '0 2px 8px -1px rgba(0,0,0,0.5), 0 1px 3px -1px rgba(0,0,0,0.4)'
        : '0 2px 8px -1px rgba(15,23,42,0.08), 0 1px 3px -1px rgba(15,23,42,0.04)',
      isDark
        ? '0 4px 16px -2px rgba(0,0,0,0.5), 0 2px 6px -2px rgba(0,0,0,0.4)'
        : '0 4px 16px -2px rgba(15,23,42,0.08), 0 2px 6px -2px rgba(15,23,42,0.04)',
      isDark
        ? '0 8px 24px -4px rgba(0,0,0,0.5)'
        : '0 8px 24px -4px rgba(15,23,42,0.1)',
      isDark
        ? '0 16px 40px -8px rgba(0,0,0,0.6)'
        : '0 16px 40px -8px rgba(15,23,42,0.12)',
      ...Array(19).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': { boxSizing: 'border-box' },
          html: { scrollBehavior: 'smooth' },
          '::-webkit-scrollbar': { width: '6px', height: '6px' },
          '::-webkit-scrollbar-track': { background: 'transparent' },
          '::-webkit-scrollbar-thumb': {
            background: isDark ? '#2D3748' : '#CBD5E1',
            borderRadius: '3px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: isDark ? '#4A5568' : '#94A3B8',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '9px 20px',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
            '&:active': { transform: 'translateY(0)' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #4F6AF0 0%, #3451CC 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #6279F2 0%, #4562E0 100%)' },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)' },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px' },
          },
          sizeLarge: { padding: '11px 28px', fontSize: '0.9375rem' },
          sizeSmall: { padding: '5px 14px', fontSize: '0.8125rem' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(79,106,240,0.1)' : 'rgba(15,23,42,0.06)'}`,
            borderRadius: 14,
            boxShadow: isDark
              ? '0 4px 16px -2px rgba(0,0,0,0.4)'
              : '0 4px 16px -2px rgba(15,23,42,0.06)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'medium' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'box-shadow 0.2s ease',
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha('#4F6AF0', 0.15)}`,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: '0.75rem', borderRadius: 6 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: isDark ? '#94A3B8' : '#64748B',
              borderBottom: `2px solid ${isDark ? 'rgba(79,106,240,0.12)' : 'rgba(15,23,42,0.07)'}`,
              backgroundColor: isDark ? alpha('#4F6AF0', 0.04) : alpha('#4F6AF0', 0.02),
              padding: '14px 16px',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.05)'}`,
            padding: '14px 16px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(79,106,240,0.05)' : 'rgba(79,106,240,0.03)',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(79,106,240,0.15)' : 'rgba(15,23,42,0.06)'}`,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          outlined: { borderRadius: 8 },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, height: 6 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 6,
            padding: '6px 12px',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: { fontWeight: 700 },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            '& .MuiPaginationItem-root': {
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10 },
          filledSuccess: { background: 'linear-gradient(135deg, #10B981, #059669)' },
          filledError: { background: 'linear-gradient(135deg, #EF4444, #DC2626)' },
          filledInfo: { background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' },
          filledWarning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)' },
        },
      },
    },
  });
};
