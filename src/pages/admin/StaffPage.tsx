import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users } from 'lucide-react';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { fetchTeachers } from '../../lib/teachersApi';
import { fetchNonTeachingStaff } from '../../lib/nonTeachingStaffApi';
import { slideUp, staggerContainer } from '../../lib/motion';

const MotionCard = motion(Card);

export default function StaffPage() {
  const navigate = useNavigate();

  const { data: teachers, isPending: teachersPending } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });
  const { data: nonTeachingStaff, isPending: staffPending } = useQuery({
    queryKey: ['non-teaching-staff'],
    queryFn: fetchNonTeachingStaff,
  });

  return (
    <PageContainer>
      <PageHeader title="Staff" subtitle="Teaching and non-teaching staff on record." />

      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          <motion.div variants={slideUp}>
            <MotionCard
              whileHover={{ y: -3 }}
              onClick={() => void navigate('/admin/staff/teaching')}
              sx={{
                p: 3,
                borderRadius: '10px',
                background: 'var(--bg-surface-1)',
                cursor: 'pointer',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--status-info-100)',
                  color: 'var(--status-info-500)',
                  mb: 2,
                }}
              >
                <Users size={22} />
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {teachersPending ? '—' : (teachers?.length ?? 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Teaching staff
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--portal-500)' }}>
                View Teaching Staff →
              </Typography>
            </MotionCard>
          </motion.div>

          <motion.div variants={slideUp}>
            <MotionCard
              whileHover={{ y: -3 }}
              onClick={() => void navigate('/admin/staff/non-teaching')}
              sx={{
                p: 3,
                borderRadius: '10px',
                background: 'var(--bg-surface-1)',
                cursor: 'pointer',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--status-success-100)',
                  color: 'var(--status-success-500)',
                  mb: 2,
                }}
              >
                <Briefcase size={22} />
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {staffPending ? '—' : (nonTeachingStaff?.length ?? 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Non-teaching staff
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--portal-500)' }}>
                View Non-Teaching Staff →
              </Typography>
            </MotionCard>
          </motion.div>
        </Box>
      </motion.div>
    </PageContainer>
  );
}
