import { Box, Card, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { slideUp } from '../../lib/motion';
import { PERIOD_SLOTS, TIMETABLE_DAYS } from '../../lib/timetableConfig';
import type { TimetableEntry } from '../../lib/timetableApi';

interface TimetableGridProps {
  entries: TimetableEntry[];
  isPending?: boolean;
  isError?: boolean;
  emptyLabel?: string;
}

function GridSkeleton() {
  return (
    <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 2 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={40}
          sx={{ mb: 1, bgcolor: 'var(--bg-surface-3)' }}
        />
      ))}
    </Card>
  );
}

export function TimetableGrid({ entries, isPending, isError, emptyLabel }: TimetableGridProps) {
  // O(1) lookup per cell instead of re-scanning `entries` for every (period, day) pair.
  const byPeriodAndDay = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    for (const entry of entries) {
      map.set(`${entry.periodNumber}-${entry.dayOfWeek}`, entry);
    }
    return map;
  }, [entries]);

  if (isPending) return <GridSkeleton />;

  if (isError) {
    return (
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Couldn&apos;t load the timetable.
        </Typography>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyLabel ?? 'No timetable published yet.'}
        </Typography>
      </Card>
    );
  }

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 2, overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `72px repeat(${TIMETABLE_DAYS.length}, minmax(96px, 1fr))`,
            minWidth: 660,
          }}
        >
          <Box />
          {TIMETABLE_DAYS.map((day) => (
            <Box key={day.key} sx={{ p: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}
              >
                {day.label.toUpperCase()}
              </Typography>
            </Box>
          ))}

          {PERIOD_SLOTS.map((slot) => (
            <Box key={slot.periodNumber || slot.label} sx={{ display: 'contents' }}>
              <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {slot.startTime}
                </Typography>
              </Box>
              {TIMETABLE_DAYS.map((day) => {
                const entry = slot.isBreak
                  ? undefined
                  : byPeriodAndDay.get(`${slot.periodNumber}-${day.key}`);
                return (
                  <Box
                    key={day.key}
                    sx={{
                      m: 0.5,
                      p: 1,
                      borderRadius: 2,
                      textAlign: 'center',
                      minHeight: 44,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: slot.isBreak
                        ? 'transparent'
                        : entry
                          ? 'var(--bg-surface-2)'
                          : 'transparent',
                      border: slot.isBreak
                        ? '1px dashed var(--border-default)'
                        : entry
                          ? '1px solid var(--border-subtle)'
                          : 'none',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: slot.isBreak ? 400 : 600,
                        color: slot.isBreak
                          ? 'var(--text-tertiary)'
                          : entry
                            ? 'var(--text-primary)'
                            : 'transparent',
                      }}
                    >
                      {slot.isBreak ? 'Break' : (entry?.subject ?? '—')}
                    </Typography>
                    {entry?.teacher && (
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 10, color: 'var(--text-tertiary)' }}
                      >
                        {entry.teacher.name}
                      </Typography>
                    )}
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
