import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Chip, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, GraduationCap, Pencil, UserPlus, Users } from 'lucide-react';
import { PageContainer } from '../../components/data-display/PageContainer';
import { CreateClassDialog } from '../../components/data-display/CreateClassDialog';
import { fetchClass, updateClass, type ClassPayload } from '../../lib/classesApi';
import { slideUp, staggerContainer } from '../../lib/motion';

const MotionCard = motion(Card);

function DetailSkeleton() {
  return (
    <PageContainer>
      <Skeleton variant="text" width={220} height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={320} height={48} />
      <Skeleton variant="text" width={240} height={24} sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={160} />
      </Box>
    </PageContainer>
  );
}

export default function ClassDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: clazz,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['classes', id],
    queryFn: () => fetchClass(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ClassPayload) => updateClass(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['classes', id] });
      void queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  if (isPending) return <DetailSkeleton />;

  if (isError || !clazz) {
    return (
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Class not found
        </Typography>
        <Button
          component={RouterLink}
          to="/admin/classes"
          startIcon={<ArrowLeft size={16} />}
          sx={{ mt: 1 }}
        >
          Back to Classes
        </Button>
      </PageContainer>
    );
  }

  const occupancyLabel = clazz.capacity
    ? `${clazz.studentCount} / ${clazz.capacity} students`
    : `${clazz.studentCount} student${clazz.studentCount === 1 ? '' : 's'}`;

  return (
    <PageContainer>
      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible">
        <motion.div variants={slideUp}>
          <Button
            component={RouterLink}
            to="/admin/classes"
            startIcon={<ArrowLeft size={16} />}
            size="small"
            sx={{ color: 'var(--text-secondary)', mb: 1.5, pl: 0 }}
          >
            Back to Classes
          </Button>
        </motion.div>

        <motion.div variants={slideUp}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              mb: 4,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {clazz.name}-{clazz.section}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {clazz.academicYear} · {occupancyLabel}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Pencil size={16} />}
              onClick={() => setEditOpen(true)}
            >
              Edit Class
            </Button>
          </Box>
        </motion.div>

        {clazz.subjects.length > 0 && (
          <motion.div variants={slideUp}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {clazz.subjects.map((s) => (
                <Chip
                  key={s.subject}
                  label={
                    s.teacher ? `${s.subject} · ${s.teacher.name}` : `${s.subject} · Unassigned`
                  }
                  size="small"
                  sx={{
                    background: s.teacher ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
                    color: s.teacher ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                    border: s.teacher ? 'none' : '1px dashed var(--border-strong)',
                  }}
                />
              ))}
            </Box>
          </motion.div>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          <motion.div variants={slideUp}>
            <MotionCard
              whileHover={{ y: -3 }}
              onClick={() => void navigate(`/admin/students?classId=${clazz.id}`)}
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
                <GraduationCap size={22} />
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {clazz.studentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Student{clazz.studentCount === 1 ? '' : 's'} enrolled
                {clazz.capacity ? ` · capacity ${clazz.capacity}` : ''}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--portal-500)' }}>
                View roster →
              </Typography>
            </MotionCard>
          </motion.div>

          <motion.div variants={slideUp}>
            {clazz.classTeacher ? (
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
                    background: 'var(--status-success-100)',
                    color: 'var(--status-success-500)',
                    mb: 2,
                  }}
                >
                  <Users size={22} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {clazz.classTeacher.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Class teacher · {clazz.classTeacher.displayId}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--portal-500)' }}>
                  View all teachers →
                </Typography>
              </MotionCard>
            ) : (
              <MotionCard
                whileHover={{ y: -3 }}
                onClick={() => setEditOpen(true)}
                sx={{
                  p: 3,
                  borderRadius: '10px',
                  background: 'var(--bg-surface-1)',
                  border: '1px dashed var(--border-strong)',
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
                    background: 'var(--bg-surface-2)',
                    color: 'var(--text-tertiary)',
                    mb: 2,
                  }}
                >
                  <UserPlus size={22} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  No class teacher yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Assign a homeroom teacher for this class.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--portal-500)' }}>
                  Assign class teacher →
                </Typography>
              </MotionCard>
            )}
          </motion.div>
        </Box>
      </motion.div>

      <CreateClassDialog
        key={editOpen ? 'open' : 'closed'}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={async (payload) => {
          await updateMutation.mutateAsync(payload);
        }}
        initial={clazz}
      />
    </PageContainer>
  );
}
