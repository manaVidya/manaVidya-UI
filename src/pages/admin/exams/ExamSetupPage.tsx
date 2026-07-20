import { useState } from 'react';
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { CreateExamDialog } from '../../../components/data-display/CreateExamDialog';
import { TableSkeleton } from '../../../components/feedback/TableSkeleton';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import {
  createExam,
  deleteExam,
  fetchExams,
  updateExam,
  type ExamListItem,
  type ExamPayload,
} from '../../../lib/examsApi';

const TABLE_COLUMNS = ['Exam', 'Type', 'Academic Year', 'Window', 'Actions'];

const EXAM_TYPE_LABEL: Record<string, string> = {
  UNIT_TEST: 'Unit Test',
  MID_TERM: 'Mid Term',
  FINAL: 'Final / Annual',
  OTHER: 'Other',
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ExamSetupPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editTarget, setEditTarget] = useState<ExamListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamListItem | null>(null);

  const { data: exams, isPending } = useQuery({
    queryKey: ['exams'],
    queryFn: () => fetchExams(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['exams'] });

  // Toasts (success and error) come from the global interceptor showing the API's
  // own message — no toast calls needed here.
  const createMutation = useMutation({ mutationFn: createExam, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExamPayload }) => updateExam(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteExam, onSuccess: invalidate });

  const openCreate = () => {
    setEditTarget(null);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = (row: ExamListItem) => {
    setEditTarget(row);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload: ExamPayload) => {
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
        title="Exam / Term Setup"
        subtitle={isPending ? 'Loading exams…' : `${exams?.length ?? 0} exam(s) configured.`}
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Create Exam
          </Button>
        }
      />

      {isPending ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Exam' },
            {
              key: 'examType',
              label: 'Type',
              render: (r) => (
                <Chip
                  label={EXAM_TYPE_LABEL[r.examType] ?? r.examType}
                  size="small"
                  sx={{ background: 'var(--bg-surface-3)', color: 'var(--text-primary)' }}
                />
              ),
            },
            { key: 'academicYear', label: 'Academic Year' },
            {
              key: 'window',
              label: 'Window',
              render: (r) => `${formatDate(r.startDate)} – ${formatDate(r.endDate)}`,
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
                      onClick={() => openEdit(r)}
                      sx={{ color: 'var(--text-secondary)' }}
                    >
                      <Pencil size={16} />
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
          rows={exams ?? []}
          emptyLabel="No exams yet — create the first one."
        />
      )}

      <CreateExamDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete exam?"
        message={`This permanently removes "${deleteTarget?.name ?? ''}" along with its exam schedule and any generated hall tickets.`}
        busy={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
