import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy-loaded page components
const LoginPage = lazy(() => import('../pages/LoginPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const TeacherPage = lazy(() => import('../pages/TeacherPage'));
const ParentPage = lazy(() => import('../pages/ParentPage'));
const StudentPage = lazy(() => import('../pages/StudentPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Suspense fallback spinner
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'background.default',
    }}
  >
    <CircularProgress sx={{ color: '#6C63FF' }} size={48} />
  </Box>
);

// Route wrapper that adds Suspense
const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: withSuspense(<LoginPage />),
  },
  {
    path: '/admin',
    element: withSuspense(<AdminPage />),
  },
  {
    path: '/teacher',
    element: withSuspense(<TeacherPage />),
  },
  {
    path: '/parent',
    element: withSuspense(<ParentPage />),
  },
  {
    path: '/student',
    element: withSuspense(<StudentPage />),
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
]);

export default router;
