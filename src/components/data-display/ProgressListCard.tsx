import { Box, Card, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';

export interface ProgressListItem {
  id: string;
  title: string;
  subtitle?: string;
  pct: number;
}

/** Used for syllabus completion, goal tracking, etc. */
export function ProgressListCard({ items }: { items: ProgressListItem[] }) {
  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
        {items.map((item, i) => (
          <Box
            key={item.id}
            sx={{
              p: 2,
              borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                {item.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--portal-400)', fontWeight: 700, flexShrink: 0 }}
              >
                {item.pct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.pct}
              sx={{
                height: 6,
                borderRadius: 3,
                background: 'var(--bg-surface-2)',
                '& .MuiLinearProgress-bar': { background: 'var(--portal-500)', borderRadius: 3 },
              }}
            />
          </Box>
        ))}
      </Card>
    </motion.div>
  );
}
