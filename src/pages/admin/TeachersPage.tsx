import { useState } from 'react';
import { Button, Chip, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { CreateTeacherDialog } from '../../components/data-display/CreateTeacherDialog';
import { TeacherAssignmentsDrawer } from '../../components/data-display/TeacherAssignmentsDrawer';
import { TableSkeleton } from '../../components/feedback/TableSkeleton';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import {
  createTeacher,
  deleteTeacher,
  fetchTeacher,
  fetchTeachers,
  updateTeacher,
  type CreateTeacherPayload,
  type TeacherDetail,
  type TeacherListItem,
} from '../../lib/teachersApi';

const TABLE_COLUMNS = ['Teacher ID', 'Name', 'Department', 'Subjects', 'Phone', 'Actions'];

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editTarget, setEditTarget] = useState<TeacherDetail | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeacherListItem | null>(null);
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);

  const { data: teachers, isPending } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['teachers'] });

  // Toasts (success and error) come from the global interceptor showing the API's
  // own message — no toast calls needed here.
  const createMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateTeacherPayload }) =>
      updateTeacher(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditTarget(null);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = async (row: TeacherListItem) => {
    setLoadingEditId(row.id);
    try {
      const detail = await fetchTeacher(row.id);
      setEditTarget(detail);
      setDialogKey((k) => k + 1);
      setDialogOpen(true);
    } catch {
      // Error toast already shown by the interceptor.
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleSubmit = async (payload: CreateTeacherPayload) => {
    if (editTarget) {
      await updateMutation.mutateAsync({ id: editTarget.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Error toast already shown; keep the confirm open so the user can retry.
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Teachers"
        subtitle={
          isPending ? 'Loading teachers…' : `${teachers?.length ?? 0} teaching staff on record.`
        }
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Create Teacher
          </Button>
        }
      />

      {isPending ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <DataTable
          columns={[
            {
              key: 'displayId',
              label: 'Teacher ID',
              render: (r) => (
                <Chip
                  label={r.displayId}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    background: 'var(--bg-surface-3)',
                    color: 'var(--text-primary)',
                  }}
                />
              ),
            },
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department', render: (r) => r.department ?? '—' },
            {
              key: 'subjects',
              label: 'Subjects',
              render: (r) => (r.subjects.length ? r.subjects.join(', ') : '—'),
            },
            { key: 'mobileNumber', label: 'Phone' },
            {
              key: 'actions',
              label: 'Actions',
              align: 'right',
              render: (r) => (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="View Assignments">
                    <IconButton
                      size="small"
                      onClick={() => setViewingTeacherId(r.id)}
                      sx={{ color: 'var(--text-secondary)' }}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => void openEdit(r)}
                      disabled={loadingEditId === r.id}
                      sx={{ color: 'var(--text-secondary)' }}
                    >
                      {loadingEditId === r.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Pencil size={16} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteTarget(r)}
                      sx={{ color: 'var(--status-error-500)' }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ),
            },
          ]}
          rows={teachers ?? []}
          emptyLabel="No teachers yet — create the first one."
        />
      )}

      <CreateTeacherDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete teacher?"
        message={`This permanently removes ${deleteTarget?.name ?? ''} (${deleteTarget?.displayId ?? ''}) and their login.`}
        busy={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />

      <TeacherAssignmentsDrawer
        open={Boolean(viewingTeacherId)}
        onClose={() => setViewingTeacherId(null)}
        teacherId={viewingTeacherId}
      />
    </PageContainer>
  );
}
