import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ChildSwitcher } from '../../components/foundation/ChildSwitcher';

export default function ChildProfilePage() {
  const { activeChild } = useAuth();

  const fields: [string, string][] = activeChild
    ? [
        ['Full Name', activeChild.name],
        ['Class', `${activeChild.className}-${activeChild.section}`],
        ['Roll No.', activeChild.rollNo],
        ['Date of Birth', activeChild.dob],
        ['Blood Group', activeChild.bloodGroup],
        ['Attendance (YTD)', `${activeChild.attendancePct}%`],
      ]
    : [];

  return (
    <PageContainer>
      <PageHeader title="Child Profile" subtitle="Details on record for the selected child." />
      <Box sx={{ mb: 3, maxWidth: 360 }}>
        <ChildSwitcher />
      </Box>
      <motion.div variants={slideUp}>
        <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
          {fields.map(([label, value], i) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: i < fields.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
