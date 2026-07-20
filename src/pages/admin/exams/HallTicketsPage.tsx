import { useState } from 'react';
import {
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Download } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { TableSkeleton } from '../../../components/feedback/TableSkeleton';
import { fetchClasses } from '../../../lib/classesApi';
import { downloadBlob } from '../../../lib/downloadBlob';
import {
  downloadHallTicketPdf,
  fetchExams,
  fetchHallTickets,
  generateHallTickets,
} from '../../../lib/examsApi';

const TABLE_COLUMNS = ['Ticket No', 'Student', 'Roll No.', 'Exam Centre', 'Seat No.', 'Download'];

export default function HallTicketGeneratorPage() {
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: exams, isPending: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => fetchExams(),
  });
  const { data: classes, isPending: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  const examId = selectedExamId ?? exams?.[0]?.id ?? null;
  const classId = selectedClassId ?? classes?.[0]?.id ?? null;

  const { data: hallTickets, isPending: ticketsLoading } = useQuery({
    queryKey: ['hall-tickets', examId, classId],
    queryFn: () => fetchHallTickets(examId!, classId!),
    enabled: Boolean(examId) && Boolean(classId),
  });

  const generateMutation = useMutation({
    mutationFn: () => generateHallTickets(examId!, classId!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['hall-tickets', examId, classId] });
    },
  });

  const handleDownload = async (studentId: string) => {
    if (!examId) return;
    setDownloadingId(studentId);
    try {
      const blob = await downloadHallTicketPdf(examId, studentId);
      downloadBlob(blob, `hall-ticket-${studentId}.pdf`);
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedClass = classes?.find((c) => c.id === classId);
  const loadingPickers = examsLoading || classesLoading;

  return (
    <PageContainer>
      <PageHeader
        title="Hall Ticket Generator"
        subtitle="Pick an exam and a class, then generate hall tickets for every active student."
        action={
          !loadingPickers &&
          exams &&
          classes &&
          exams.length > 0 &&
          classes.length > 0 && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select value={examId ?? ''} onChange={(e) => setSelectedExamId(e.target.value)}>
                  {exams.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={classId ?? ''} onChange={(e) => setSelectedClassId(e.target.value)}>
                  {classes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}-{c.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={!examId || !classId || generateMutation.isPending}
                onClick={() => generateMutation.mutate()}
              >
                {generateMutation.isPending ? 'Generating…' : 'Generate All'}
              </Button>
            </Stack>
          )
        }
      />

      {!loadingPickers && (!exams || exams.length === 0) ? (
        <Typography variant="body2" color="text.secondary">
          No exams yet — create one on the Exam / Term Setup page first.
        </Typography>
      ) : !loadingPickers && (!classes || classes.length === 0) ? (
        <Typography variant="body2" color="text.secondary">
          No classes yet — create one on the Classes & Sections page first.
        </Typography>
      ) : ticketsLoading || loadingPickers ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <DataTable
          columns={[
            {
              key: 'ticketNo',
              label: 'Ticket No',
              render: (r) => (
                <Chip
                  label={r.ticketNo}
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
            { key: 'studentName', label: 'Student' },
            { key: 'rollNo', label: 'Roll No.' },
            { key: 'examCenter', label: 'Exam Centre', render: (r) => r.examCenter ?? '—' },
            { key: 'seatNo', label: 'Seat No.', render: (r) => r.seatNo ?? '—' },
            {
              key: 'download',
              label: 'Download',
              align: 'right',
              render: (r) => (
                <Tooltip title="Download hall ticket PDF">
                  <IconButton
                    size="small"
                    onClick={() => void handleDownload(r.studentId)}
                    disabled={downloadingId === r.studentId}
                    sx={{ color: 'var(--text-secondary)' }}
                  >
                    <Download size={16} />
                  </IconButton>
                </Tooltip>
              ),
            },
          ]}
          rows={hallTickets ?? []}
          emptyLabel={
            selectedClass
              ? `No hall tickets generated yet for ${selectedClass.name}-${selectedClass.section}.`
              : undefined
          }
        />
      )}
    </PageContainer>
  );
}
