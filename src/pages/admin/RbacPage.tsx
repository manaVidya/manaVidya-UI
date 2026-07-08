import { Box, Card, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ROLE_PERMISSIONS } from '../../lib/rolePermissions';

const PORTAL_LABEL: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
};

export default function RbacPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Resolved module.action keys per role — the same matrix from §4 that drives nav visibility."
      />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
          <motion.div key={role} variants={slideUp}>
            <Card sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                {PORTAL_LABEL[role]}{' '}
                <Typography component="span" variant="caption" color="text.secondary">
                  · {perms.length} permissions
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {perms.map((p) => (
                  <Chip
                    key={p}
                    label={p}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: 'var(--portal-500)' }}
                  />
                ))}
              </Box>
            </Card>
          </motion.div>
        ))}
      </Box>
    </PageContainer>
  );
}
