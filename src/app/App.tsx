import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import router from '../router';
import { useAuth } from '../hooks/useAuth';
import { fetchCurrentUser } from '../lib/authApi';
import { getAccessToken, clearTokens } from '../lib/tokenStorage';

export default function App() {
  const { isBootstrapping, setUser, setBootstrapped } = useAuth();

  useEffect(() => {
    if (!getAccessToken()) {
      setBootstrapped();
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(setBootstrapped);
    // Runs once on app mount to restore the session from a stored access token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isBootstrapping) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress sx={{ color: 'var(--portal-500)' }} size={40} />
      </Box>
    );
  }

  return <RouterProvider router={router} />;
}
