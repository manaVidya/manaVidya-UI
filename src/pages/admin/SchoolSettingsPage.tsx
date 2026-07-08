import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { MOCK_SCHOOL_SETTINGS } from '../../lib/mockData';

const FIELDS: [string, string | number][] = [
  ['School Name', MOCK_SCHOOL_SETTINGS.schoolName],
  ['Pilot Circle', MOCK_SCHOOL_SETTINGS.circle],
  ['Academic Year', MOCK_SCHOOL_SETTINGS.academicYear],
  ['Address', MOCK_SCHOOL_SETTINGS.address],
  ['Principal', MOCK_SCHOOL_SETTINGS.principal],
  ['Student Strength', MOCK_SCHOOL_SETTINGS.studentStrength],
  ['Teacher Strength', MOCK_SCHOOL_SETTINGS.teacherStrength],
];

export default function SchoolSettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="School Settings" subtitle="Global configuration for this school." />
      <motion.div variants={slideUp}>
        <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
          {FIELDS.map(([label, value], i) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: i < FIELDS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Card>
      </motion.div>
    </PageContainer>
  );
}
