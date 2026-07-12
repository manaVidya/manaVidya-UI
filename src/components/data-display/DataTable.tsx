import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { slideUp } from '../../lib/motion';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

/** Renders primitive cell values only — avoids stringifying an object to "[object Object]". */
function renderPrimitive(value: unknown): ReactNode {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? value
    : '';
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyLabel?: string;
  /** When set, whole rows become clickable (cursor + hover cue) — e.g. drilling into a detail page. */
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = 'No records yet',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: '10px', background: 'var(--bg-surface-1)', overflow: 'hidden' }}>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'var(--bg-surface-2)' }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align ?? 'left'}
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      py: 1.5,
                      borderBottom: '2px solid var(--border-default)',
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
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
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    '&:hover': { background: 'var(--bg-surface-2)' },
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? 'left'}
                      sx={{
                        color: 'var(--text-primary)',
                        fontSize: 13.5,
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {col.render
                        ? col.render(row)
                        : renderPrimitive((row as Record<string, unknown>)[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </motion.div>
  );
}
