import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { PortalSwitcher } from '../../components/foundation/PortalSwitcher';
import { ChildSwitcher } from '../../components/foundation/ChildSwitcher';

const PORTAL_LABEL: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
};

export default function ProfilePage() {
  const { user, availablePortals } = useAuth();

  if (!user) return null;

  return (
    <PageContainer>
      <PageHeader title="My Profile" subtitle="Your account details and portal access." />

      <motion.div variants={slideUp}>
        <Card sx={{ p: 4, borderRadius: 3, background: 'var(--bg-surface-1)', mb: 3 }}>
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--text-inverse)',
                flexShrink: 0,
              }}
            >
              {user.name.slice(0, 1).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.mobileNumber}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: 'var(--border-subtle)', mb: 2.5 }} />

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Active portal
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {user.portal}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Roles on this account
              </Typography>
              <Stack direction="row" sx={{ gap: 0.75, mt: 0.5 }}>
                {availablePortals.map((r) => (
                  <Chip
                    key={r}
                    label={PORTAL_LABEL[r]}
                    size="small"
                    sx={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Card>
      </motion.div>

      {availablePortals.length > 1 && (
        <motion.div variants={slideUp}>
          <Card sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Switch portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This account has access to more than one portal — switch to preview it.
            </Typography>
            <PortalSwitcher compact />
          </Card>
        </motion.div>
      )}

      {user.portal === 'parent' && user.children && user.children.length > 0 && (
        <motion.div variants={slideUp}>
          <Card sx={{ p: 3, borderRadius: 3, background: 'var(--bg-surface-1)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Linked children
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Switch which child&apos;s data the parent portal is currently showing.
            </Typography>
            <ChildSwitcher compact />
          </Card>
        </motion.div>
      )}
    </PageContainer>
  );
}
