import { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { MOCK_STUDENTS } from '../../lib/mockData';

/** Teacher's results-entry list — local state only, nothing persisted yet. */
export function GradeEntryList({
  subject = 'Mathematics',
  outOf = 100,
}: {
  subject?: string;
  outOf?: number;
}) {
  const [marks, setMarks] = useState<Record<string, string>>(() =>
    Object.fromEntries(MOCK_STUDENTS.map((s, i) => [s.id, String(65 + ((i * 7) % 30))])),
  );

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid var(--border-subtle)' }}>
          <Typography variant="body2" color="text.secondary">
            {subject} · out of {outOf}
          </Typography>
        </Box>
        {MOCK_STUDENTS.map((student, i) => (
          <Box
            key={student.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              gap: 2,
              borderBottom:
                i < MOCK_STUDENTS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
              component="input"
              value={marks[student.id]}
              onChange={(e) => setMarks((m) => ({ ...m, [student.id]: e.target.value }))}
              sx={{
                width: 56,
                textAlign: 'center',
                border: '1px solid var(--border-default)',
                borderRadius: 1.5,
                background: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                fontSize: 14,
                fontFamily: 'inherit',
                py: 0.75,
                outline: 'none',
                '&:focus': { borderColor: 'var(--portal-500)' },
              }}
            />
          </Box>
        ))}
      </Card>
    </motion.div>
  );
}
