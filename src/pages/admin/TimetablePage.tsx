import { useMemo, useState } from 'react';
import { Button, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';
import { TimetableEditor } from '../../components/data-display/TimetableEditor';
import { fetchClasses } from '../../lib/classesApi';
import { fetchTeachers } from '../../lib/teachersApi';
import { fetchSubjects } from '../../lib/subjectsApi';
import {
  bulkSaveTimetable,
  fetchClassTimetable,
  type TimetableEntryPayload,
} from '../../lib/timetableApi';

export default function AdminTimetablePage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const { data: classes, isPending: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  // Defaults to the first class once the list loads, rather than an empty prompt state —
  // derived at render time (no effect) so there's no extra render cycle to sync it.
  const classId = selectedClassId ?? classes?.[0]?.id ?? null;

  const {
    data: entries,
    isPending: timetableLoading,
    isError: timetableError,
  } = useQuery({
    queryKey: ['timetable', 'class', classId],
    queryFn: () => fetchClassTimetable(classId!),
    enabled: Boolean(classId),
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    enabled: editing,
  });
  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    enabled: editing,
  });
  const subjectOptions = useMemo(
    () => (subjects ?? []).filter((s) => s.isActive).map((s) => s.name),
    [subjects],
  );
  const teacherOptions = useMemo(
    () => (teachers ?? []).map((t) => ({ id: t.id, name: t.name })),
    [teachers],
  );

  const saveMutation = useMutation({
    mutationFn: (payloadEntries: TimetableEntryPayload[]) =>
      bulkSaveTimetable({ classId: classId!, entries: payloadEntries }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['timetable', 'class', classId] });
      setEditing(false);
    },
  });

  const selectedClass = classes?.find((c) => c.id === classId);

  return (
    <PageContainer>
      <PageHeader
        title="Timetable"
        subtitle="Pick a class to view or build its weekly schedule."
        action={
          !classesLoading &&
          classes &&
          classes.length > 0 && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
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
                <Button
                  variant="outlined"
                  startIcon={<Pencil size={16} />}
                  disabled={!classId}
                  onClick={() => setEditing(true)}
                >
                  Edit Timetable
                </Button>
              )}
            </Stack>
          )
        }
      />

      {!classesLoading && classes && classes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No classes yet — create one on the Classes & Sections page first.
        </Typography>
      ) : editing && classId ? (
        <TimetableEditor
          entries={entries ?? []}
          subjectOptions={subjectOptions}
          teacherOptions={teacherOptions}
          onSave={(payloadEntries) => saveMutation.mutateAsync(payloadEntries).then(() => {})}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <TimetableGrid
          entries={entries ?? []}
          isPending={classesLoading || timetableLoading}
          isError={timetableError}
          emptyLabel={
            selectedClass
              ? `No timetable built yet for ${selectedClass.name}-${selectedClass.section}.`
              : undefined
          }
        />
      )}
    </PageContainer>
  );
}
