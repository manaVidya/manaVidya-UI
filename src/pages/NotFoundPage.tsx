import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../lib/motion';
import { useNavigate } from 'react-router-dom';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';

const MotionBox = motion(Box);

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 4,
      }}
    >
      <MotionBox
        variants={slideUp}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <ErrorOutlined sx={{ fontSize: 72, color: 'var(--portal-400)', opacity: 0.6 }} />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '5rem', md: '8rem' },
            color: 'var(--portal-500)',
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 360 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          id="back-home-btn"
          onClick={() => {
            void navigate('/');
          }}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </MotionBox>
    </Box>
  );
}
