import { useMemo, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel as MuiInputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Plus, Save, X } from 'lucide-react';
import type { ClassListItem, ClassPayload, ClassSubjectPayload } from '../../lib/classesApi';
import { fetchTeachers, type TeacherListItem } from '../../lib/teachersApi';
import { fetchSubjects } from '../../lib/subjectsApi';

interface CreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the API-shaped payload; throw/reject to keep the dialog open on failure. */
  onSubmit: (payload: ClassPayload) => Promise<void>;
  /** When set, the dialog opens prefilled in edit mode. */
  initial?: ClassListItem | null;
}

/** Form's own shape for a subject row — teacherId is '' (not undefined) so it binds cleanly to a Select. */
interface SubjectRow {
  subject: string;
  teacherId: string;
}

function getInitialForm(initial?: ClassListItem | null) {
  return {
    name: initial?.name ?? '',
    section: initial?.section ?? '',
    academicYear: initial?.academicYear ?? '',
    capacity: initial?.capacity ? String(initial.capacity) : '',
    classTeacherId: initial?.classTeacher?.id ?? '',
    // A new class starts with no subjects — nothing in the school's catalog is a
    // sensible default to pre-select before that data is loaded.
    subjects: (initial?.subjects.map((s) => ({
      subject: s.subject,
      teacherId: s.teacher?.id ?? '',
    })) ?? []) as SubjectRow[],
  };
}

type FormState = ReturnType<typeof getInitialForm>;

/** Reconciles the multi-select's new subject-name list against the current rows,
 *  keeping each surviving subject's assigned teacher and dropping the rest. */
function syncSubjectNames(current: SubjectRow[], names: string[]): SubjectRow[] {
  const byName = new Map(current.map((row) => [row.subject, row]));
  return names.map((name) => byName.get(name) ?? { subject: name, teacherId: '' });
}

function buildPayload(form: FormState): ClassPayload {
  const subjects: ClassSubjectPayload[] = form.subjects.map((row) => ({
    subject: row.subject,
    teacherId: row.teacherId || undefined,
  }));
  return {
    name: form.name.trim(),
    section: form.section.trim(),
    academicYear: form.academicYear.trim() || undefined,
    capacity: form.capacity ? Number(form.capacity) : undefined,
    classTeacherId: form.classTeacherId || undefined,
    subjects,
  };
}

export function CreateClassDialog({ open, onClose, onSubmit, initial }: CreateClassDialogProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => getInitialForm(initial));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Only fetched while the dialog is actually open — no point loading the teacher
  // directory on every Classes page visit if nobody opens the create/edit form.
  const { data: teachers, isPending: teachersLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    enabled: open,
  });

  // The subject picker's options come from the school's standard subject catalog
  // (Subjects module) — not from whatever individual teachers happen to have tagged
  // on their own profile.
  const { data: subjects, isPending: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    enabled: open,
  });
  const availableSubjects = useMemo(
    () => (subjects ?? []).filter((s) => s.isActive).map((s) => s.name),
    [subjects],
  );

  // Always includes the currently-assigned teacher for this subject even if their own
  // profile no longer lists it — otherwise an existing assignment would silently vanish
  // from the dropdown the moment a teacher's subjects change.
  const teachersForSubject = (subject: string, currentTeacherId: string): TeacherListItem[] =>
    (teachers ?? []).filter((t) => t.subjects.includes(subject) || t.id === currentTeacherId);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setSubjectTeacher = (subject: string, teacherId: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.map((row) => (row.subject === subject ? { ...row, teacherId } : row)),
    }));
  };

  const handleTextChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, e.target.value as FormState[typeof field]);
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isRequiredString = (value: string) => value.trim().length > 0;
  const canSubmit = isRequiredString(form.name) && isRequiredString(form.section);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(buildPayload(form));
      setForm(getInitialForm());
      setTouched({});
      onClose();
    } catch {
      // Toast already showed the API error (e.g. duplicate class, teacher conflict).
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(getInitialForm());
    setTouched({});
    onClose();
  };

  const renderError = (field: keyof FormState, message: string) =>
    touched[field] && !isRequiredString(form[field] as string) ? message : '';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
          },
        },
      }}
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEdit ? `Edit Class — ${initial?.name}-${initial?.section}` : 'Create Class'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {isEdit
              ? 'Students already enrolled here are unaffected — this only changes the class record.'
              : 'Add a class-section before enrolling students, or let the student form create it automatically.'}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              label="Class Name *"
              fullWidth
              value={form.name}
              onChange={handleTextChange('name')}
              onBlur={handleBlur('name')}
              error={!!renderError('name', 'Required')}
              helperText={renderError('name', 'Class name is required')}
              placeholder="e.g. Grade 5"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              label="Section *"
              fullWidth
              value={form.section}
              onChange={handleTextChange('section')}
              onBlur={handleBlur('section')}
              error={!!renderError('section', 'Required')}
              helperText={renderError('section', 'Section is required')}
              placeholder="e.g. A"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              label="Academic Year"
              fullWidth
              value={form.academicYear}
              onChange={handleTextChange('academicYear')}
              placeholder="Defaults to the school's current year"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              label="Capacity"
              type="number"
              fullWidth
              value={form.capacity}
              onChange={handleTextChange('capacity')}
              placeholder="Optional"
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <MuiInputLabel shrink>Class Teacher</MuiInputLabel>
              <Select
                value={form.classTeacherId}
                onChange={(e) => updateField('classTeacherId', e.target.value)}
                label="Class Teacher"
                displayEmpty
                notched
                disabled={teachersLoading}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {teachers?.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} ({t.displayId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth disabled={subjectsLoading}>
              <MuiInputLabel>Subjects</MuiInputLabel>
              <Select
                multiple
                value={form.subjects.map((row) => row.subject)}
                onChange={(e) =>
                  updateField(
                    'subjects',
                    syncSubjectNames(form.subjects, e.target.value as string[]),
                  )
                }
                input={<OutlinedInput label="Subjects" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availableSubjects.length === 0 ? (
                  <MenuItem value="" disabled>
                    <em>No active subjects configured for this school</em>
                  </MenuItem>
                ) : (
                  availableSubjects.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {form.subjects.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Subject teacher (optional per subject)
              </Typography>
              <Stack
                spacing={1}
                sx={{
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  p: 1.5,
                  background: 'var(--bg-surface-1)',
                }}
              >
                {form.subjects.map((row) => (
                  <Stack
                    key={row.subject}
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Typography variant="body2" sx={{ width: 140, flexShrink: 0 }}>
                      {row.subject}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.teacherId}
                        onChange={(e) => setSubjectTeacher(row.subject, e.target.value)}
                        displayEmpty
                        disabled={teachersLoading}
                      >
                        <MenuItem value="">
                          <em>Unassigned</em>
                        </MenuItem>
                        {teachersForSubject(row.subject, row.teacherId).map((t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {t.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit || submitting}
          startIcon={isEdit ? <Save size={18} /> : <Plus size={18} />}
          onClick={() => void handleSubmit()}
        >
          {submitting
            ? isEdit
              ? 'Saving…'
              : 'Creating…'
            : isEdit
              ? 'Save Changes'
              : 'Create Class'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
