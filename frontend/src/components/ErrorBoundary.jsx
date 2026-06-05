import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              textAlign: 'center',
              gap: 3
            }}
          >
            <WarningAmberIcon color="warning" sx={{ fontSize: 80 }} />
            <Typography variant="h4" fontWeight="bold">
              Something went wrong.
            </Typography>
            <Typography color="text.secondary">
              An unexpected layout error occurred. You can reload the page or return to the main dashboard.
            </Typography>
            {this.state.error && (
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'action.hover', 
                  borderRadius: 1, 
                  width: '100%', 
                  textAlign: 'left',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                {this.state.error.toString()}
              </Box>
            )}
            <Button 
              variant="contained" 
              onClick={this.handleReset}
              sx={{ mt: 2 }}
            >
              Go to Homepage
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
