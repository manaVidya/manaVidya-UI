import { useMemo, useState } from 'react';
import { Button, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Download, Pencil } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { ExamScheduleEditor } from '../../../components/data-display/ExamScheduleEditor';
import { TableSkeleton } from '../../../components/feedback/TableSkeleton';
import { fetchClasses } from '../../../lib/classesApi';
import { fetchSubjects } from '../../../lib/subjectsApi';
import { downloadBlob } from '../../../lib/downloadBlob';
import {
  bulkSaveExamSchedule,
  downloadExamTimetablePdf,
  fetchExamSchedule,
  fetchExams,
  type ExamScheduleEntryPayload,
} from '../../../lib/examsApi';

const TABLE_COLUMNS = ['Subject', 'Date', 'Time', 'Max Marks', 'Room'];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ExamTimetableBuilderPage() {
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data: exams, isPending: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => fetchExams(),
  });
  const { data: classes, isPending: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    enabled: editing,
  });
  const subjectOptions = useMemo(
    () => (subjects ?? []).filter((s) => s.isActive).map((s) => s.name),
    [subjects],
  );

  const examId = selectedExamId ?? exams?.[0]?.id ?? null;
  const classId = selectedClassId ?? classes?.[0]?.id ?? null;

  const {
    data: entries,
    isPending: scheduleLoading,
    isError: scheduleError,
  } = useQuery({
    queryKey: ['exam-schedule', examId, classId],
    queryFn: () => fetchExamSchedule(examId!, classId!),
    enabled: Boolean(examId) && Boolean(classId),
  });

  const saveMutation = useMutation({
    mutationFn: (payloadEntries: ExamScheduleEntryPayload[]) =>
      bulkSaveExamSchedule(examId!, classId!, payloadEntries),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['exam-schedule', examId, classId] });
      setEditing(false);
    },
  });

  const handleDownload = async () => {
    if (!examId || !classId) return;
    setDownloading(true);
    try {
      const blob = await downloadExamTimetablePdf(examId, classId);
      downloadBlob(blob, `exam-timetable-${classId}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const selectedClass = classes?.find((c) => c.id === classId);
  const selectedExam = exams?.find((e) => e.id === examId);
  const loadingPickers = examsLoading || classesLoading;

  return (
    <PageContainer>
      <PageHeader
        title="Exam Timetable Builder"
        subtitle="Pick an exam and a class to view or build its exam schedule."
        action={
          !loadingPickers &&
          exams &&
          classes &&
          exams.length > 0 &&
          classes.length > 0 && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={examId ?? ''}
                  onChange={(e) => {
                    setSelectedExamId(e.target.value);
                    setEditing(false);
                  }}
                >
                  {exams.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={classId ?? ''}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setEditing(false);
                  }}
                >
                  {classes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}-{c.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!editing && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Pencil size={16} />}
                    disabled={!examId || !classId}
                    onClick={() => setEditing(true)}
                  >
                    Edit Schedule
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download size={16} />}
                    disabled={!examId || !classId || downloading}
                    onClick={() => void handleDownload()}
                  >
                    {downloading ? 'Preparing…' : 'Download PDF'}
                  </Button>
                </>
              )}
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
      ) : editing && examId && classId ? (
        <ExamScheduleEditor
          entries={entries ?? []}
          subjectOptions={subjectOptions}
          onSave={(payloadEntries) => saveMutation.mutateAsync(payloadEntries).then(() => {})}
          onCancel={() => setEditing(false)}
        />
      ) : scheduleLoading || loadingPickers ? (
        <TableSkeleton columns={TABLE_COLUMNS} />
      ) : (
        <DataTable
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'date', label: 'Date', render: (r) => formatDate(r.examDate) },
            {
              key: 'time',
              label: 'Time',
              render: (r) => `${r.startTime} - ${r.endTime}`,
            },
            { key: 'maxMarks', label: 'Max Marks' },
            { key: 'roomNo', label: 'Room', render: (r) => r.roomNo ?? '—' },
          ]}
          rows={entries ?? []}
          emptyLabel={
            selectedExam && selectedClass
              ? `No exam schedule built yet for ${selectedClass.name}-${selectedClass.section}.`
              : undefined
          }
        />
      )}
      {scheduleError && (
        <Typography variant="body2" color="error">
          Could not load the exam schedule.
        </Typography>
      )}
    </PageContainer>
  );
}
