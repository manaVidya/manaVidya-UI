import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';

const MotionCard = motion(Card);

export interface StatItem {
  label: string;
  value: string;
}

export function StatCardGrid({ stats }: { stats: StatItem[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' },
        gap: 2.5,
        mb: 4,
      }}
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={slideUp}>
          <MotionCard
            whileHover={{ y: -3 }}
            sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)' }}
          >
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'var(--portal-400)' }}>
              {stat.value}
            </Typography>
          </MotionCard>
        </motion.div>
      ))}
    </Box>
  );
}
