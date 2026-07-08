import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { MOCK_TIMETABLE, TIMETABLE_DAYS } from '../../lib/mockData';

export function TimetableGrid() {
  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 2, overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `72px repeat(${TIMETABLE_DAYS.length}, minmax(88px, 1fr))`,
            minWidth: 620,
          }}
        >
          <Box />
          {TIMETABLE_DAYS.map((day) => (
            <Box key={day} sx={{ p: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}
              >
                {day.toUpperCase()}
              </Typography>
            </Box>
          ))}

          {MOCK_TIMETABLE.map((period) => (
            <Box key={period.time} sx={{ display: 'contents' }}>
              <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {period.time}
                </Typography>
              </Box>
              {period.subjects.map((subject, i) => {
                const isBreak = subject === 'Break';
                return (
                  <Box
                    key={i}
                    sx={{
                      m: 0.5,
                      p: 1,
                      borderRadius: 2,
                      textAlign: 'center',
                      minHeight: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isBreak
                        ? 'transparent'
                        : subject
                          ? 'var(--bg-surface-2)'
                          : 'transparent',
                      border: isBreak
                        ? '1px dashed var(--border-default)'
                        : subject
                          ? '1px solid var(--border-subtle)'
                          : 'none',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: isBreak ? 400 : 600,
                        color: isBreak
                          ? 'var(--text-tertiary)'
                          : subject
                            ? 'var(--text-primary)'
                            : 'transparent',
                      }}
                    >
                      {subject ?? '—'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Card>
    </motion.div>
  );
}
