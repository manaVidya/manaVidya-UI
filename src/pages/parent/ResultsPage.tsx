import { Box, Card, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_RESULTS } from '../../lib/mockData';

export default function ParentResultsPage() {
  const total = MOCK_RESULTS.reduce((acc, r) => acc + r.marks, 0);
  const outOf = MOCK_RESULTS.reduce((acc, r) => acc + r.outOf, 0);
  const pct = Math.round((total / outOf) * 100);

  return (
    <PageContainer>
      <PageHeader title="Results / Report Card" subtitle="Term 1 — 2026-27" />

      <motion.div variants={slideUp}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'var(--bg-surface-1)',
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Overall percentage
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'var(--portal-400)' }}>
              {pct}%
            </Typography>
          </Box>
          <Chip
            label="Pass"
            sx={{
              background: 'var(--status-success-100)',
              color: 'var(--status-success-500)',
              fontWeight: 700,
            }}
          />
        </Card>
      </motion.div>

      <DataTable
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'marks', label: 'Marks', render: (r) => `${r.marks} / ${r.outOf}` },
          { key: 'grade', label: 'Grade' },
        ]}
        rows={MOCK_RESULTS.map((r, i) => ({ id: `res-${i}`, ...r }))}
      />
    </PageContainer>
  );
}
