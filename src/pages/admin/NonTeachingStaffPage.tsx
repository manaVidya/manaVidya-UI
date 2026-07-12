import { useState } from 'react';
import { Button, Chip, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { CreateNonTeachingStaffDialog } from '../../components/data-display/CreateNonTeachingStaffDialog';
import { TableSkeleton } from '../../components/feedback/TableSkeleton';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import {
  createNonTeachingStaff,
  deleteNonTeachingStaff,
  fetchNonTeachingStaff,
  fetchNonTeachingStaffMember,
  updateNonTeachingStaff,
  type CreateNonTeachingStaffPayload,
  type NonTeachingStaffDetail,
  type NonTeachingStaffListItem,
} from '../../lib/nonTeachingStaffApi';

const TABLE_COLUMNS = ['Staff ID', 'Name', 'Designation', 'Department', 'Phone', 'Actions'];

export default function NonTeachingStaffPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editTarget, setEditTarget] = useState<NonTeachingStaffDetail | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NonTeachingStaffListItem | null>(null);

  const { data: staff, isPending } = useQuery({
    queryKey: ['non-teaching-staff'],
    queryFn: fetchNonTeachingStaff,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['non-teaching-staff'] });

  // Toasts (success and error) come from the global interceptor showing the API's
  // own message — no toast calls needed here.
  const createMutation = useMutation({
    mutationFn: createNonTeachingStaff,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateNonTeachingStaffPayload }) =>
      updateNonTeachingStaff(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNonTeachingStaff,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditTarget(null);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = async (row: NonTeachingStaffListItem) => {
    setLoadingEditId(row.id);
    try {
      const detail = await fetchNonTeachingStaffMember(row.id);
      setEditTarget(detail);
      setDialogKey((k) => k + 1);
      setDialogOpen(true);
    } catch {
      // Error toast already shown by the interceptor.
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleSubmit = async (payload: CreateNonTeachingStaffPayload) => {
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
        title="Non-Teaching Staff"
        subtitle={
          isPending ? 'Loading staff…' : `${staff?.length ?? 0} non-teaching staff on record.`
        }
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Create Staff
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
              label: 'Staff ID',
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
            { key: 'designation', label: 'Designation' },
            { key: 'department', label: 'Department', render: (r) => r.department ?? '—' },
            { key: 'mobileNumber', label: 'Phone' },
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
          rows={staff ?? []}
          emptyLabel="No non-teaching staff yet — create the first one."
        />
      )}

      <CreateNonTeachingStaffDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete staff member?"
        message={`This permanently removes ${deleteTarget?.name ?? ''} (${deleteTarget?.displayId ?? ''}).`}
        busy={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
