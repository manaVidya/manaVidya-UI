import { Card, Stack, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { StatCardGrid, type StatItem } from '../../components/data-display/StatCardGrid';

interface PortalDashboardPlaceholderProps {
  greeting: string;
  subtitle: string;
  stats: StatItem[];
}

export function PortalDashboardPlaceholder({
  greeting,
  subtitle,
  stats,
}: PortalDashboardPlaceholderProps) {
  const { user } = useAuth();
  const { permissions } = usePermissions();

  return (
    <PageContainer>
      <PageHeader title={greeting} subtitle={subtitle} />
      <StatCardGrid stats={stats} />

      <motion.div variants={slideUp}>
        <Card sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)' }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Signed in as
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user?.name} · <code>{user?.portal}</code> portal · {user?.mobileNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Resolved permissions (drives which nav items render, per §4 RBAC matrix):
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {permissions.map((p) => (
              <Chip
                key={p}
                label={p}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'var(--portal-500)' }}
              />
            ))}
          </Stack>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
