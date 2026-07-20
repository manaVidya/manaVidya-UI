import { Box, Chip, Drawer, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { fetchTeacher } from '../../lib/teachersApi';

interface TeacherAssignmentsDrawerProps {
  open: boolean;
  onClose: () => void;
  teacherId: string | null;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

export function TeacherAssignmentsDrawer({
  open,
  onClose,
  teacherId,
}: TeacherAssignmentsDrawerProps) {
  const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['teachers', teacherId],
    queryFn: () => fetchTeacher(teacherId!),
    enabled: open && Boolean(teacherId),
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            background: 'var(--bg-surface-2)',
            borderLeft: '1px solid var(--border-default)',
          },
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}
        >
          <Box>
            {isPending ? (
              <>
                <Skeleton variant="text" width={160} height={32} />
                <Skeleton variant="text" width={100} height={20} />
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {teacher?.user.name ?? 'Teacher'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teacher?.displayId}
                </Typography>
              </>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </IconButton>
        </Stack>

        {isPending ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={20} width={120} />
            <Skeleton variant="rounded" height={32} />
            <Skeleton variant="rounded" height={20} width={160} sx={{ mt: 2 }} />
            <Skeleton variant="rounded" height={80} />
          </Stack>
        ) : isError || !teacher ? (
          <Typography variant="body2" color="text.secondary">
            Couldn&apos;t load this teacher&apos;s details.
          </Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <SectionLabel>Homeroom Class</SectionLabel>
              {teacher.classesLed.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Not currently a homeroom teacher for any class.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {teacher.classesLed.map((c) => (
                    <Chip
                      key={c.id}
                      label={`${c.name}-${c.section} · ${c.academicYear}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        background: 'var(--bg-surface-3)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Box>
              <SectionLabel>Subject Assignments</SectionLabel>
              {teacher.subjectAssignments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No subject assignments yet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {teacher.subjectAssignments.map((a) => (
                    <Stack
                      key={a.id}
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.25,
                        borderRadius: '8px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {a.subject}
                      </Typography>
                      <Chip
                        label={`${a.class.name}-${a.class.section} · ${a.class.academicYear}`}
                        size="small"
                        sx={{ background: 'var(--bg-surface-3)', color: 'var(--text-secondary)' }}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
