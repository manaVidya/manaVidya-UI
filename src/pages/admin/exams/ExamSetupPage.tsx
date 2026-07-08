import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../../lib/motion';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';

const TERMS = [
  { name: 'Term 1 — Half Yearly', window: 'Completed · Oct 2025' },
  { name: 'Term 2 — Annual', window: 'Upcoming · 20–26 Jul 2026' },
];

export default function ExamSetupPage() {
  return (
    <PageContainer>
      <PageHeader title="Exam / Term Setup" subtitle="Academic terms configured for 2026–27." />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {TERMS.map((term) => (
          <motion.div key={term.name} variants={slideUp}>
            <Card sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {term.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {term.window}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </Box>
    </PageContainer>
  );
}
