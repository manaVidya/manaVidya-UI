import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';

type DayStatus = 'present' | 'absent' | 'holiday' | 'future';

function statusForDay(day: number, daysInMonth: number, weekday: number): DayStatus {
  if (weekday === 0) return 'holiday'; // Sunday
  if (day > daysInMonth - 3) return 'future'; // last few days not yet marked
  if (day % 11 === 0 || day % 17 === 0) return 'absent';
  return 'present';
}

const STATUS_LABEL: Record<DayStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  holiday: 'Holiday',
  future: 'Not yet marked',
};

function statusColor(status: DayStatus): string {
  switch (status) {
    case 'present':
      return 'var(--status-success-500)';
    case 'absent':
      return 'var(--status-error-500)';
    case 'holiday':
      return 'var(--text-tertiary)';
    case 'future':
    default:
      return 'transparent';
  }
}

interface AttendanceCalendarProps {
  year?: number;
  month?: number; // 0-indexed
}

export function AttendanceCalendar({ year = 2026, month = 6 }: AttendanceCalendarProps) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const cells: { day: number | null; status?: DayStatus }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = (startWeekday + day - 1) % 7;
    cells.push({ day, status: statusForDay(day, daysInMonth, weekday) });
  }

  const presentCount = cells.filter((c) => c.status === 'present').length;
  const markedCount = cells.filter((c) => c.status === 'present' || c.status === 'absent').length;
  const pct = markedCount ? Math.round((presentCount / markedCount) * 100) : 0;

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}
        >
          <Typography variant="h6">
            {firstOfMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--portal-400)', fontWeight: 700 }}>
            {pct}% this month
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75, mb: 1.5 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Typography
              key={i}
              variant="caption"
              align="center"
              sx={{ color: 'var(--text-tertiary)', fontWeight: 600 }}
            >
              {d}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75 }}>
          {cells.map((cell, i) => (
            <Box
              key={i}
              title={cell.status ? STATUS_LABEL[cell.status] : undefined}
              sx={{
                aspectRatio: '1',
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color:
                  cell.status === 'present' || cell.status === 'absent'
                    ? 'var(--text-inverse)'
                    : 'var(--text-secondary)',
                background:
                  cell.day == null
                    ? 'transparent'
                    : cell.status
                      ? statusColor(cell.status)
                      : 'var(--bg-surface-2)',
                opacity: cell.status === 'holiday' ? 0.35 : cell.status === 'future' ? 0.4 : 1,
                border: cell.status === 'future' ? '1px dashed var(--border-default)' : 'none',
              }}
            >
              {cell.day ?? ''}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, mt: 2.5, flexWrap: 'wrap' }}>
          {(['present', 'absent', 'holiday'] as DayStatus[]).map((s) => (
            <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: statusColor(s),
                  opacity: s === 'holiday' ? 0.35 : 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {STATUS_LABEL[s]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </motion.div>
  );
}
