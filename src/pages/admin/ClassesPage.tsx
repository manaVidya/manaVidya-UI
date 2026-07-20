import { useMemo, useState } from 'react';
import { Button, FormControl, MenuItem, Select, Stack } from '@mui/material';
import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ClassesTreeTable } from '../../components/data-display/ClassesTreeTable';
import { CreateClassDialog } from '../../components/data-display/CreateClassDialog';
import { TableSkeleton } from '../../components/feedback/TableSkeleton';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import {
  createClass,
  deleteClass,
  fetchClasses,
  updateClass,
  type ClassListItem,
  type ClassPayload,
} from '../../lib/classesApi';

// Leading blank entry keeps the loading skeleton's header aligned with
// ClassesTreeTable's chevron column once real data swaps in.
const TABLE_COLUMNS = ['', 'Class', 'Academic Year', 'Class Teacher', 'Students', 'Actions'];

export default function ClassesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editTarget, setEditTarget] = useState<ClassListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassListItem | null>(null);

  const { data: classes, isPending } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  // Derived from whatever years are actually present in the fetched classes — no
  // separate "current academic year" source exists anywhere in this app yet, and a
  // year with zero classes has nothing to filter to regardless.
  const availableYears = useMemo(
    () => [...new Set((classes ?? []).map((c) => c.academicYear))].sort(),
    [classes],
  );
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const effectiveYear = yearFilter ?? availableYears.at(-1) ?? '';
  const filteredClasses = useMemo(
    () => (classes ?? []).filter((c) => !effectiveYear || c.academicYear === effectiveYear),
    [classes, effectiveYear],
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['classes'] });

  // Toasts (success and error) come from the global interceptor showing the API's
  // own message — no toast calls needed here.
  const createMutation = useMutation({
    mutationFn: createClass,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ClassPayload }) =>
      updateClass(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditTarget(null);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = (row: ClassListItem) => {
    setEditTarget(row);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload: ClassPayload) => {
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
      // Error toast already shown (e.g. "N student(s) enrolled"); keep the confirm open to retry.
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Classes & Sections"
        subtitle={isPending ? 'Loading classes…' : `${classes?.length ?? 0} classes on record.`}
        action={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {availableYears.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select value={effectiveYear} onChange={(e) => setYearFilter(e.target.value)}>
                  <MenuItem value="">All Years</MenuItem>
                  {availableYears.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
              Create Class
            </Button>
          </Stack>
        }
      />

      {isPending ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <ClassesTreeTable
          rows={filteredClasses}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onRowClick={(r) => void navigate(`/admin/classes/${r.id}`)}
          emptyLabel="No classes yet — create the first one."
        />
      )}

      <CreateClassDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete class?"
        message={`This permanently removes ${deleteTarget?.name ?? ''}-${deleteTarget?.section ?? ''}. Blocked automatically while students are still enrolled.`}
        busy={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
