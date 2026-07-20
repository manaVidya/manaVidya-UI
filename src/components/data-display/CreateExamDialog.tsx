import { useState, type ChangeEvent } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Save, X } from 'lucide-react';
import type { ExamListItem, ExamPayload, ExamType } from '../../lib/examsApi';

interface CreateExamDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the API-shaped payload; throw/reject to keep the dialog open on failure. */
  onSubmit: (payload: ExamPayload) => Promise<void>;
  /** When set, the dialog opens prefilled in edit mode. */
  initial?: ExamListItem | null;
}

const EXAM_TYPES: { value: ExamType; label: string }[] = [
  { value: 'UNIT_TEST', label: 'Unit Test' },
  { value: 'MID_TERM', label: 'Mid Term' },
  { value: 'FINAL', label: 'Final / Annual' },
  { value: 'OTHER', label: 'Other' },
];

const toDateInput = (value: string | null | undefined) => (value ?? '').slice(0, 10);

function getInitialForm(initial?: ExamListItem | null) {
  return {
    name: initial?.name ?? '',
    examType: initial?.examType ?? ('' as ExamType | ''),
    academicYear: initial?.academicYear ?? '',
    startDate: toDateInput(initial?.startDate),
    endDate: toDateInput(initial?.endDate),
  };
}

type FormState = ReturnType<typeof getInitialForm>;

function buildPayload(form: FormState): ExamPayload {
  return {
    name: form.name.trim(),
    examType: form.examType as ExamType,
    academicYear: form.academicYear.trim() || undefined,
    startDate: form.startDate,
    endDate: form.endDate,
  };
}

export function CreateExamDialog({ open, onClose, onSubmit, initial }: CreateExamDialogProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => getInitialForm(initial));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, e.target.value);
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const canSubmit =
    form.name.trim().length > 0 &&
    Boolean(form.examType) &&
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    form.startDate <= form.endDate;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(buildPayload(form));
      setForm(getInitialForm());
      setTouched({});
      onClose();
    } catch {
      // Toast already showed the API error; keep the dialog open for corrections.
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
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Exam' : 'Create Exam'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <TextField
              label="Exam Name *"
              fullWidth
              value={form.name}
              onChange={handleTextChange('name')}
              onBlur={handleBlur('name')}
              placeholder="e.g. Mid Term Exam"
              error={touched.name && form.name.trim().length === 0}
              helperText={
                touched.name && form.name.trim().length === 0 ? 'Exam name is required' : ''
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={touched.examType && !form.examType}>
              <InputLabel shrink>Exam Type *</InputLabel>
              <Select
                value={form.examType}
                onChange={(e) => updateField('examType', e.target.value)}
                onBlur={handleBlur('examType')}
                label="Exam Type *"
                displayEmpty
                notched
              >
                <MenuItem value="">
                  <em>Select type</em>
                </MenuItem>
                {EXAM_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Academic Year"
              fullWidth
              value={form.academicYear}
              onChange={handleTextChange('academicYear')}
              placeholder="Defaults to school's current year"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Start Date *"
              type="date"
              fullWidth
              value={form.startDate}
              onChange={handleTextChange('startDate')}
              onBlur={handleBlur('startDate')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="End Date *"
              type="date"
              fullWidth
              value={form.endDate}
              onChange={handleTextChange('endDate')}
              onBlur={handleBlur('endDate')}
              error={touched.endDate && form.startDate > form.endDate && Boolean(form.endDate)}
              helperText={
                touched.endDate && form.startDate > form.endDate && form.endDate
                  ? 'End date must be on/after the start date'
                  : ''
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
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
              : 'Create Exam'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
