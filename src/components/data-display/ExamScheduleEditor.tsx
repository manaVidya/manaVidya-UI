import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { ExamScheduleEntry, ExamScheduleEntryPayload } from '../../lib/examsApi';

interface DraftRow {
  key: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: string;
  roomNo: string;
}

let draftKeySeq = 0;
const newDraftKey = () => `row-${draftKeySeq++}`;

function toDraftRows(entries: ExamScheduleEntry[]): DraftRow[] {
  return entries.map((e) => ({
    key: newDraftKey(),
    subject: e.subject,
    examDate: e.examDate.slice(0, 10),
    startTime: e.startTime,
    endTime: e.endTime,
    maxMarks: String(e.maxMarks),
    roomNo: e.roomNo ?? '',
  }));
}

interface ExamScheduleEditorProps {
  entries: ExamScheduleEntry[];
  subjectOptions: string[];
  onSave: (entries: ExamScheduleEntryPayload[]) => Promise<void>;
  onCancel: () => void;
}

export function ExamScheduleEditor({
  entries,
  subjectOptions,
  onSave,
  onCancel,
}: ExamScheduleEditorProps) {
  const [rows, setRows] = useState<DraftRow[]>(() => toDraftRows(entries));
  const [saving, setSaving] = useState(false);

  const updateRow = (key: string, patch: Partial<DraftRow>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        key: newDraftKey(),
        subject: '',
        examDate: '',
        startTime: '',
        endTime: '',
        maxMarks: '100',
        roomNo: '',
      },
    ]);
  };

  const removeRow = (key: string) => {
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  const isRowComplete = (r: DraftRow) =>
    r.subject && r.examDate && r.startTime && r.endTime && r.maxMarks;

  const canSave = rows.length > 0 && rows.every(isRowComplete);

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const payload: ExamScheduleEntryPayload[] = rows.map((r) => ({
        subject: r.subject,
        examDate: r.examDate,
        startTime: r.startTime,
        endTime: r.endTime,
        maxMarks: Number(r.maxMarks),
        roomNo: r.roomNo.trim() || undefined,
      }));
      await onSave(payload);
    } catch {
      // Toast already showed the API error (e.g. overlapping slots); keep the editor open to fix.
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={1.5}>
        {rows.map((r) => (
          <Box
            key={r.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 0.9fr 0.9fr 0.8fr 0.9fr auto',
              gap: 1,
              alignItems: 'center',
              p: 1.25,
              borderRadius: 2,
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Select
              size="small"
              value={r.subject}
              displayEmpty
              onChange={(e) => updateRow(r.key, { subject: e.target.value })}
            >
              <MenuItem value="">
                <em>Subject</em>
              </MenuItem>
              {subjectOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              type="date"
              value={r.examDate}
              onChange={(e) => updateRow(r.key, { examDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="time"
              value={r.startTime}
              onChange={(e) => updateRow(r.key, { startTime: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="time"
              value={r.endTime}
              onChange={(e) => updateRow(r.key, { endTime: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="number"
              label="Max Marks"
              value={r.maxMarks}
              onChange={(e) => updateRow(r.key, { maxMarks: e.target.value })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: 1 } }}
            />
            <TextField
              size="small"
              label="Room"
              value={r.roomNo}
              onChange={(e) => updateRow(r.key, { roomNo: e.target.value })}
              placeholder="Optional"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <IconButton
              size="small"
              onClick={() => removeRow(r.key)}
              sx={{ color: 'var(--status-error-500)' }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
        ))}
        {rows.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No subjects added yet.
          </Typography>
        )}
      </Stack>

      <Box>
        <Button variant="outlined" size="small" startIcon={<Plus size={16} />} onClick={addRow}>
          Add Subject
        </Button>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          disabled={!canSave || saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save Schedule'}
        </Button>
      </Stack>
    </Stack>
  );
}
