import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp, staggerChildren } from '../lib/motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const MotionStack = motion(Stack);
const MotionBox = motion(Box);

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 60% 30%, rgba(108,99,255,0.18) 0%, transparent 60%), #0D0E1A',
      }}
    >
      <MotionStack
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        spacing={3}
        sx={{
          alignItems: 'center',
          p: 6,
          borderRadius: 3,
          border: '1px solid rgba(108,99,255,0.2)',
          background: 'rgba(19,21,42,0.8)',
          backdropFilter: 'blur(20px)',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <MotionBox variants={slideUp}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF, #9D97FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
        </MotionBox>

        <MotionBox variants={slideUp} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your <strong>ManaVidya</strong> account
          </Typography>
        </MotionBox>

        <MotionBox variants={slideUp} sx={{ width: '100%' }}>
          <Button variant="contained" fullWidth size="large" id="login-btn">
            Sign In
          </Button>
        </MotionBox>

        <MotionBox variants={slideUp}>
          <Typography variant="caption" color="text.secondary">
            Route: <code>/login</code> · Role placeholder
          </Typography>
        </MotionBox>
      </MotionStack>
    </Box>
  );
}
