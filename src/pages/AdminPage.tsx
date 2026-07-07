import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/motion';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { type ElementType } from 'react';

const MotionBox = motion(Box);

interface RolePlaceholderProps {
  role: string;
  route: string;
  color: string;
  Icon: ElementType;
  description: string;
}

export function RolePlaceholder({ role, route, color, Icon, description }: RolePlaceholderProps) {
  return (
    <MotionBox
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        background: `radial-gradient(ellipse at 50% 20%, ${color}22 0%, transparent 55%), #0D0E1A`,
        p: 4,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 32px ${color}44`,
        }}
      >
        <Icon sx={{ color: '#fff', fontSize: 36 }} />
      </Box>

      <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center' }}>
        {role} Dashboard
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', maxWidth: 420 }}
      >
        {description}
      </Typography>

      <Chip
        label={`Route: ${route}`}
        variant="outlined"
        sx={{ borderColor: color, color: color, fontFamily: 'monospace' }}
      />
    </MotionBox>
  );
}

export default function AdminPage() {
  return (
    <RolePlaceholder
      role="Admin"
      route="/admin"
      color="#6C63FF"
      Icon={AdminPanelSettingsOutlinedIcon}
      description="Full platform management — users, roles, institutions, analytics and settings."
    />
  );
}
