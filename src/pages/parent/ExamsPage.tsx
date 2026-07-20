import { useState } from 'react';
import { Button, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { TableSkeleton } from '../../components/feedback/TableSkeleton';
import { downloadBlob } from '../../lib/downloadBlob';
import { downloadMyHallTicketPdf, fetchExams, fetchMyExamSchedule } from '../../lib/examsApi';

const TABLE_COLUMNS = ['Subject', 'Date', 'Time', 'Room'];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ParentExamsPage() {
  const { activeChild } = useAuth();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { data: exams, isPending: examsLoading } = useQuery({
    queryKey: ['exams', 'me'],
    queryFn: () => fetchExams(),
  });
  const examId = selectedExamId ?? exams?.[0]?.id ?? null;

  const { data: entries, isPending: scheduleLoading } = useQuery({
    queryKey: ['exam-schedule', 'me', 'parent', examId, activeChild?.id],
    queryFn: () => fetchMyExamSchedule(examId!, 'parent', activeChild!.id),
    enabled: Boolean(examId) && Boolean(activeChild),
  });

  const handleDownload = async () => {
    if (!examId || !activeChild) return;
    setDownloading(true);
    try {
      const blob = await downloadMyHallTicketPdf(examId, 'parent', activeChild.id);
      downloadBlob(blob, `hall-ticket-${activeChild.name}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Exam Timetable & Hall Ticket"
        subtitle={
          activeChild ? `${activeChild.name}'s exam schedule and hall ticket.` : 'Exam schedule.'
        }
        action={
          !examsLoading &&
          exams &&
          exams.length > 0 && (
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
              <Button
                variant="contained"
                startIcon={<Download size={18} />}
                disabled={!examId || !activeChild || downloading}
                onClick={() => void handleDownload()}
              >
                {downloading ? 'Preparing…' : 'Download Hall Ticket'}
              </Button>
            </Stack>
          )
        }
      />

      {!examsLoading && (!exams || exams.length === 0) ? (
        <Typography variant="body2" color="text.secondary">
          No exams have been scheduled yet.
        </Typography>
      ) : scheduleLoading || examsLoading || !activeChild ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <DataTable
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'date', label: 'Date', render: (r) => formatDate(r.examDate) },
            { key: 'time', label: 'Time', render: (r) => `${r.startTime} - ${r.endTime}` },
            { key: 'roomNo', label: 'Room', render: (r) => r.roomNo ?? '—' },
          ]}
          rows={entries ?? []}
          emptyLabel="No exam schedule published yet."
        />
      )}
    </PageContainer>
  );
}
