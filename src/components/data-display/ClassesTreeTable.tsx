import { Fragment, useMemo, useState } from 'react';
import {
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { ClassListItem } from '../../lib/classesApi';
import { slideUp } from '../../lib/motion';

interface ClassesTreeTableProps {
  /** Already filtered (e.g. by academic year) — grouping happens after filtering. */
  rows: ClassListItem[];
  onEdit: (row: ClassListItem) => void;
  onDelete: (row: ClassListItem) => void;
  /** Fired on a section (child) row click only — parent rows just toggle expand. */
  onRowClick: (row: ClassListItem) => void;
  emptyLabel?: string;
}

interface ClassGroup {
  name: string;
  academicYear: string;
  sections: ClassListItem[];
  totalStudents: number;
}

const HEADERS = ['', 'Class', 'Academic Year', 'Class Teacher', 'Students', 'Actions'];

/** Groups flat class-section rows by class name — "Grade 5" as parent, its A/B/C
 *  sections as children. Each group keeps the first section's academic year for
 *  display; callers are expected to filter to one year before this runs so a group
 *  never silently mixes sections from two different years under one header. */
function groupByName(rows: ClassListItem[]): ClassGroup[] {
  const byName = new Map<string, ClassListItem[]>();
  for (const row of rows) {
    const list = byName.get(row.name) ?? [];
    list.push(row);
    byName.set(row.name, list);
  }
  return [...byName.entries()]
    .map(([name, sections]) => ({
      name,
      academicYear: sections[0].academicYear,
      sections: [...sections].sort((a, b) => a.section.localeCompare(b.section)),
      totalStudents: sections.reduce((sum, s) => sum + s.studentCount, 0),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function ClassesTreeTable({
  rows,
  onEdit,
  onDelete,
  onRowClick,
  emptyLabel = 'No classes yet',
}: ClassesTreeTableProps) {
  const groups = useMemo(() => groupByName(rows), [rows]);

  // Collapsed-by-name set, not expanded-by-name — so a newly-created class group
  // (not yet in this set) starts expanded, matching "default all expanded."
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (name: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: '10px', background: 'var(--bg-surface-1)', overflow: 'hidden' }}>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'var(--bg-surface-2)' }}>
                {HEADERS.map((label, i) => (
                  <TableCell
                    key={label || `col-${i}`}
                    align={label === 'Actions' ? 'right' : 'left'}
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      py: 1.5,
                      borderBottom: '2px solid var(--border-default)',
                      width: i === 0 ? 40 : undefined,
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={HEADERS.length}
                    align="center"
                    sx={{
                      color: 'var(--text-tertiary)',
                      borderColor: 'var(--border-subtle)',
                      py: 4,
                    }}
                  >
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
              {groups.map((group) => {
                const isExpanded = !collapsed.has(group.name);
                return (
                  <Fragment key={group.name}>
                    <TableRow
                      onClick={() => toggle(group.name)}
                      sx={{ cursor: 'pointer', '&:hover': { background: 'var(--bg-surface-2)' } }}
                    >
                      <TableCell sx={{ borderColor: 'var(--border-subtle)' }}>
                        <IconButton size="small" sx={{ color: 'var(--text-secondary)' }}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'var(--border-subtle)' }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Typography
                            sx={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}
                          >
                            {group.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {group.sections.length} section{group.sections.length === 1 ? '' : 's'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--text-primary)',
                          fontSize: 13.5,
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {group.academicYear}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--text-tertiary)',
                          fontSize: 13.5,
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        —
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--text-primary)',
                          fontSize: 13.5,
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {group.totalStudents}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'var(--border-subtle)' }} />
                    </TableRow>
                    {isExpanded &&
                      group.sections.map((row) => (
                        <TableRow
                          key={row.id}
                          onClick={() => onRowClick(row)}
                          sx={{
                            '&:hover': { background: 'var(--bg-surface-2)' },
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell sx={{ borderColor: 'var(--border-subtle)' }} />
                          <TableCell sx={{ borderColor: 'var(--border-subtle)', pl: 5 }}>
                            <Chip
                              label={`${row.name}-${row.section}`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                background: 'var(--bg-surface-3)',
                                color: 'var(--text-primary)',
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'var(--text-primary)',
                              fontSize: 13.5,
                              borderColor: 'var(--border-subtle)',
                            }}
                          >
                            {row.academicYear}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'var(--text-primary)',
                              fontSize: 13.5,
                              borderColor: 'var(--border-subtle)',
                            }}
                          >
                            {row.classTeacher?.name ?? '—'}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'var(--text-primary)',
                              fontSize: 13.5,
                              borderColor: 'var(--border-subtle)',
                            }}
                          >
                            {row.capacity
                              ? `${row.studentCount} / ${row.capacity}`
                              : row.studentCount}
                          </TableCell>
                          <TableCell align="right" sx={{ borderColor: 'var(--border-subtle)' }}>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{ justifyContent: 'flex-end' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(row)}
                                  sx={{ color: 'var(--text-secondary)' }}
                                >
                                  <Pencil size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  sx={{ color: 'var(--status-error-500)' }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </motion.div>
  );
}
