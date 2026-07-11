import { useState } from 'react';
import { Button, Chip, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { CreateStudentDialog } from '../../components/data-display/CreateStudentDialog';
import { TableSkeleton } from '../../components/feedback/TableSkeleton';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import {
  createStudent,
  deleteStudent,
  fetchStudent,
  fetchStudents,
  updateStudent,
  type CreateStudentPayload,
  type StudentDetail,
  type StudentListItem,
} from '../../lib/studentsApi';

const TABLE_COLUMNS = ['Student ID', 'Name', 'Class', 'Roll No.', 'Guardian', 'Status', 'Actions'];

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  ACTIVE: { bg: 'var(--status-success-100)', fg: 'var(--status-success-500)' },
  TRANSFERRED: { bg: 'var(--status-info-100)', fg: 'var(--status-info-500)' },
  ALUMNI: { bg: 'var(--status-warning-100)', fg: 'var(--status-warning-500)' },
  SUSPENDED: { bg: 'var(--status-error-100)', fg: 'var(--status-error-500)' },
};

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editTarget, setEditTarget] = useState<StudentDetail | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentListItem | null>(null);

  const { data: students, isPending } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['students'] });

  // Toasts (success and error) come from the global interceptor showing the API's
  // own message — no toast calls needed here.
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateStudentPayload }) =>
      updateStudent(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditTarget(null);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = async (row: StudentListItem) => {
    setLoadingEditId(row.id);
    try {
      const detail = await fetchStudent(row.id);
      setEditTarget(detail);
      setDialogKey((k) => k + 1);
      setDialogOpen(true);
    } catch {
      // Error toast already shown by the interceptor.
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleSubmit = async (payload: CreateStudentPayload) => {
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
        title="Students"
        subtitle={isPending ? 'Loading students…' : `${students?.length ?? 0} students on record.`}
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Create Student
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
              label: 'Student ID',
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
            { key: 'class', label: 'Class', render: (r) => `${r.className}-${r.section}` },
            { key: 'rollNo', label: 'Roll No.' },
            {
              key: 'guardian',
              label: 'Guardian',
              render: (r) => `${r.guardianName} · ${r.guardianPhone}`,
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => {
                const color = STATUS_COLOR[r.status] ?? STATUS_COLOR.ACTIVE;
                return (
                  <Chip
                    label={r.status}
                    size="small"
                    sx={{ background: color.bg, color: color.fg, fontWeight: 600 }}
                  />
                );
              },
            },
            {
              key: 'actions',
              label: 'Actions',
              align: 'right',
              render: (r) => (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
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
          rows={students ?? []}
          emptyLabel="No students yet — create the first one."
        />
      )}

      <CreateStudentDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete student?"
        message={`This permanently removes ${deleteTarget?.name ?? ''} (${deleteTarget?.displayId ?? ''}) and their login. Guardian accounts are kept.`}
        busy={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
