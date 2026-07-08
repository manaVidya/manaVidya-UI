import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer } from '../../lib/motion';

const MotionBox = motion(Box);

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <MotionBox
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      sx={{ maxWidth: 1100, mx: 'auto' }}
    >
      {children}
    </MotionBox>
  );
}
