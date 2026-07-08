import { Box, Typography, Stack, Card, CardActionArea } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Users, UserRound } from 'lucide-react';
import type { ElementType } from 'react';
import { slideUp, staggerContainer } from '../../lib/motion';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_PERMISSIONS } from '../../lib/rolePermissions';
import { MOCK_CHILDREN } from '../../lib/mockData';
import type { PortalKey } from '../../types/rbac';
import { PORTAL_LABELS } from '../../theme/portalPalettes';

/**
 * Dev-only role → multi-role mapping. Demonstrates the two multi-role cases
 * called out in the spec: Admin previewing every portal, and a Teacher who
 * is also a parent at the same school (types/rbac.ts's own example).
 */
const ROLES_FOR: Record<PortalKey, PortalKey[]> = {
  admin: ['admin', 'teacher', 'parent', 'student'],
  teacher: ['teacher', 'parent'],
  parent: ['parent'],
  student: ['student'],
};

const MotionStack = motion(Stack);
const MotionCard = motion(Card);

interface PortalOption {
  portal: PortalKey;
  icon: ElementType;
  name: string;
  description: string;
}

const PORTAL_OPTIONS: PortalOption[] = [
  {
    portal: 'admin',
    icon: ShieldCheck,
    name: 'Admin',
    description: 'Full platform management & oversight',
  },
  { portal: 'teacher', icon: Users, name: 'Teacher', description: 'Classes, attendance, grading' },
  { portal: 'parent', icon: UserRound, name: 'Parent', description: "Track your child's progress" },
  {
    portal: 'student',
    icon: GraduationCap,
    name: 'Student',
    description: 'Assignments, results, timetable',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  function enterAs(portal: PortalKey) {
    const roles = ROLES_FOR[portal];
    const hasChildren = roles.includes('parent');

    setUser({
      id: `dev-${portal}`,
      name: PORTAL_LABELS[portal],
      mobileNumber: '+91 90000 00000',
      portal,
      roles,
      permissions: ROLE_PERMISSIONS[portal],
      children: hasChildren ? MOCK_CHILDREN : undefined,
      activeChildId: hasChildren ? MOCK_CHILDREN[0].id : undefined,
    });
    void navigate(`/${portal}`);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <MotionStack
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        spacing={4}
        sx={{ alignItems: 'center', maxWidth: 720, width: '100%' }}
      >
        <motion.div variants={slideUp} style={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to ManaVidya
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dev preview — pick a portal to explore its screens. Real authentication lands with the
            backend.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
            width: '100%',
          }}
        >
          {PORTAL_OPTIONS.map(({ portal, icon: Icon, name, description }) => (
            <motion.div key={portal} variants={slideUp}>
              <MotionCard
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                data-portal={portal}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid var(--portal-500)',
                  background: 'var(--bg-surface-1)',
                }}
              >
                <CardActionArea onClick={() => enterAs(portal)} sx={{ p: 3 }}>
                  <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
                      }}
                    >
                      <Icon size={24} color="var(--text-inverse)" />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Stack>
                </CardActionArea>
              </MotionCard>
            </motion.div>
          ))}
        </Box>

        <motion.div variants={slideUp}>
          <Typography variant="caption" color="text.secondary">
            Route: <code>/login</code> · four-portal dev picker
          </Typography>
        </motion.div>
      </MotionStack>
    </Box>
  );
}
