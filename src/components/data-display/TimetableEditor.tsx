import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Save } from 'lucide-react';
import { PERIOD_SLOTS, TIMETABLE_DAYS } from '../../lib/timetableConfig';
import type { DayOfWeek, TimetableEntry, TimetableEntryPayload } from '../../lib/timetableApi';

interface DraftCell {
  subject: string;
  teacherId: string;
}

type TeacherOption = { id: string; name: string };

interface TimetableEditorProps {
  entries: TimetableEntry[];
  subjectOptions: string[];
  teacherOptions: TeacherOption[];
  onSave: (entries: TimetableEntryPayload[]) => Promise<void>;
  onCancel: () => void;
}

const cellKey = (day: DayOfWeek, periodNumber: number) => `${day}:${periodNumber}`;

function buildInitialDraft(entries: TimetableEntry[]): Map<string, DraftCell> {
  const draft = new Map<string, DraftCell>();
  for (const e of entries) {
    draft.set(cellKey(e.dayOfWeek, e.periodNumber), {
      subject: e.subject,
      teacherId: e.teacher?.id ?? '',
    });
  }
  return draft;
}

export function TimetableEditor({
  entries,
  subjectOptions,
  teacherOptions,
  onSave,
  onCancel,
}: TimetableEditorProps) {
  const [draft, setDraft] = useState<Map<string, DraftCell>>(() => buildInitialDraft(entries));
  const [selected, setSelected] = useState<{ day: DayOfWeek; periodNumber: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const teacherById = useMemo(
    () => new Map(teacherOptions.map((t) => [t.id, t.name])),
    [teacherOptions],
  );

  const selectedKey = selected ? cellKey(selected.day, selected.periodNumber) : null;
  const selectedCell = selectedKey
    ? (draft.get(selectedKey) ?? { subject: '', teacherId: '' })
    : null;
  const selectedSlot = selected
    ? PERIOD_SLOTS.find((s) => s.periodNumber === selected.periodNumber)
    : undefined;
  const selectedDay = selected ? TIMETABLE_DAYS.find((d) => d.key === selected.day) : undefined;

  const updateSelectedCell = (patch: Partial<DraftCell>) => {
    if (!selectedKey) return;
    setDraft((prev) => {
      const next = new Map(prev);
      const current = next.get(selectedKey) ?? { subject: '', teacherId: '' };
      const updated = { ...current, ...patch };
      if (!updated.subject) next.delete(selectedKey);
      else next.set(selectedKey, updated);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const payloadEntries: TimetableEntryPayload[] = [];
    for (const [key, cell] of draft.entries()) {
      if (!cell.subject) continue;
      const [day, periodStr] = key.split(':');
      const periodNumber = Number(periodStr);
      const slot = PERIOD_SLOTS.find((s) => s.periodNumber === periodNumber);
      if (!slot) continue;
      payloadEntries.push({
        dayOfWeek: day as DayOfWeek,
        periodNumber,
        subject: cell.subject,
        teacherId: cell.teacherId || undefined,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
    try {
      await onSave(payloadEntries);
    } catch {
      // Toast already showed the API error (e.g. teacher clash); keep the editor open to fix.
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `72px repeat(${TIMETABLE_DAYS.length}, minmax(96px, 1fr))`,
            minWidth: 660,
          }}
        >
          <Box />
          {TIMETABLE_DAYS.map((day) => (
            <Box key={day.key} sx={{ p: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}
              >
                {day.label.toUpperCase()}
              </Typography>
            </Box>
          ))}

          {PERIOD_SLOTS.map((slot) => (
            <Box key={slot.periodNumber || slot.label} sx={{ display: 'contents' }}>
              <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {slot.startTime}
                </Typography>
              </Box>
              {TIMETABLE_DAYS.map((day) => {
                if (slot.isBreak) {
                  return (
                    <Box
                      key={day.key}
                      sx={{
                        m: 0.5,
                        p: 1,
                        borderRadius: 2,
                        minHeight: 44,
                        border: '1px dashed var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                        Break
                      </Typography>
                    </Box>
                  );
                }
                const cell = draft.get(cellKey(day.key, slot.periodNumber));
                const isSelected =
                  selected?.day === day.key && selected.periodNumber === slot.periodNumber;
                return (
                  <ButtonBase
                    key={day.key}
                    onClick={() => setSelected({ day: day.key, periodNumber: slot.periodNumber })}
                    sx={{
                      m: 0.5,
                      p: 1,
                      borderRadius: 2,
                      minHeight: 44,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background: cell ? 'var(--bg-surface-2)' : 'transparent',
                      border: isSelected
                        ? '2px solid var(--portal-500)'
                        : cell
                          ? '1px solid var(--border-subtle)'
                          : '1px dashed var(--border-subtle)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: cell ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      }}
                    >
                      {cell?.subject ?? 'Free'}
                    </Typography>
                    {cell?.teacherId && teacherById.has(cell.teacherId) && (
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 10, color: 'var(--text-tertiary)' }}
                      >
                        {teacherById.get(cell.teacherId)}
                      </Typography>
                    )}
                  </ButtonBase>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {selected && selectedSlot && selectedDay && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            p: 1.5,
            borderRadius: '10px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, width: 140, flexShrink: 0 }}>
            {selectedDay.label} · {selectedSlot.startTime}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedCell?.subject ?? ''}
              onChange={(e) => updateSelectedCell({ subject: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">
                <em>Free period</em>
              </MenuItem>
              {subjectOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }} disabled={!selectedCell?.subject}>
            <Select
              value={selectedCell?.teacherId ?? ''}
              onChange={(e) => updateSelectedCell({ teacherId: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {teacherOptions.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save Timetable'}
        </Button>
      </Stack>
    </Stack>
  );
}
