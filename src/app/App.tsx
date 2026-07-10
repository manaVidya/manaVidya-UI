import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import router from '../router';
import { useAuth } from '../hooks/useAuth';
import { useTokenKeepAlive } from '../hooks/useTokenKeepAlive';
import { fetchCurrentUser } from '../lib/authApi';

export default function App() {
  const { isBootstrapping, setUser, setBootstrapped } = useAuth();

  useTokenKeepAlive();

  useEffect(() => {
    // The access token never survives a fresh page load (it's memory-only, by design —
    // see lib/authToken.ts). This probe rides the httpOnly refresh cookie, if any, via the
    // silent 401-refresh dance in lib/api.ts to find out whether there's a live session.
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(setBootstrapped);
    // Runs once on app mount to restore the session from the refresh cookie, if present.
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
