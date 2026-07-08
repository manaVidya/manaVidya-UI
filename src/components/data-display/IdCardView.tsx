import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { MOCK_SCHOOL_SETTINGS } from '../../lib/mockData';

interface IdCardViewProps {
  name: string;
  className: string;
  section: string;
  rollNo: string;
  idNumber: string;
}

export function IdCardView({ name, className, section, rollNo, idNumber }: IdCardViewProps) {
  return (
    <motion.div variants={slideUp}>
      <Box
        sx={{
          maxWidth: 380,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface-1)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        }}
      >
        <Box
          sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, var(--portal-500), var(--portal-700))',
            color: 'var(--text-inverse)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {MOCK_SCHOOL_SETTINGS.schoolName}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            Student Identity Card · {MOCK_SCHOOL_SETTINGS.academicYear}
          </Typography>
        </Box>

        <Box sx={{ p: 3, display: 'flex', gap: 2.5 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 2,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
              background: 'var(--bg-surface-2)',
              color: 'var(--portal-400)',
            }}
          >
            {name.slice(0, 1)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Class {className}-{section} · Roll No. {rollNo}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              ID: {idNumber}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            height: 28,
            background:
              'repeating-linear-gradient(90deg, var(--text-primary) 0 2px, transparent 2px 5px)',
            opacity: 0.6,
            mx: 3,
            mb: 3,
          }}
        />
      </Box>
    </motion.div>
  );
}
