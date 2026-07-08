import { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { MOCK_STUDENTS } from '../../lib/mockData';

type Mark = 'present' | 'absent';

/** Teacher's daily attendance-marking grid — local state only, nothing persisted yet. */
export function AttendanceMarkGrid() {
  const [marks, setMarks] = useState<Record<string, Mark>>(() =>
    Object.fromEntries(MOCK_STUDENTS.map((s): [string, Mark] => [s.id, 'present'])),
  );

  const presentCount = Object.values(marks).filter((m) => m === 'present').length;

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tap a student to toggle present / absent
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--portal-400)' }}>
            {presentCount}/{MOCK_STUDENTS.length} present
          </Typography>
        </Box>
        {MOCK_STUDENTS.map((student, i) => {
          const mark = marks[student.id];
          const isPresent = mark === 'present';
          return (
            <Box
              key={student.id}
              onClick={() =>
                setMarks((m) => ({ ...m, [student.id]: isPresent ? 'absent' : 'present' }))
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                borderBottom:
                  i < MOCK_STUDENTS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                '&:hover': { background: 'var(--bg-surface-2)' },
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {student.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Roll No. {student.rollNo}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-inverse)',
                  background: isPresent ? 'var(--status-success-500)' : 'var(--status-error-500)',
                }}
              >
                {isPresent ? 'Present' : 'Absent'}
              </Box>
            </Box>
          );
        })}
      </Card>
    </motion.div>
  );
}
