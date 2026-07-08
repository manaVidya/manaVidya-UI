import { Box, Card, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { slideUp } from '../../lib/motion';
import type { NotificationRow } from '../../lib/mockData';

export function NotificationListCard({ items }: { items: NotificationRow[] }) {
  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
        {items.map((n, i) => (
          <Box
            key={n.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 2,
              borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface-2)',
                color: 'var(--portal-400)',
              }}
            >
              <Bell size={16} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {n.title}
                </Typography>
                {n.priority === 'high' && (
                  <Chip
                    label="Important"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      background: 'var(--status-error-100)',
                      color: 'var(--status-error-500)',
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {n.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                {n.date}
              </Typography>
            </Box>
          </Box>
        ))}
      </Card>
    </motion.div>
  );
}
