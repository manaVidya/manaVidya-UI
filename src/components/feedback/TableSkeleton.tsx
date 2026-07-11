import {
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';

interface TableSkeletonProps {
  /** Column labels — rendered for real so the header doesn't jump when data lands. */
  columns: string[];
  rows?: number;
}

/**
 * Content-shaped loading state for DataTable: real header + shimmering ("wave")
 * placeholder rows in the same Card shell, so the swap to live data causes no
 * layout shift. Row opacity fades slightly toward the bottom — the standard
 * skeleton treatment that reads as "loading" rather than "empty".
 */
export function TableSkeleton({ columns, rows = 6 }: TableSkeletonProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', overflow: 'hidden' }}>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'var(--bg-surface-2)' }}>
                {columns.map((label) => (
                  <TableCell
                    key={label}
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
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rows }, (_, rowIdx) => (
                <TableRow key={rowIdx} sx={{ opacity: 1 - rowIdx * 0.09 }}>
                  {columns.map((label, colIdx) => (
                    <TableCell key={label} sx={{ borderColor: 'var(--border-subtle)' }}>
                      <Skeleton
                        animation="wave"
                        height={20}
                        // Vary widths so the shimmer reads as text, not uniform bars.
                        width={`${55 + ((rowIdx * 17 + colIdx * 29) % 40)}%`}
                        sx={{ bgcolor: 'var(--bg-surface-3)' }}
                      />
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
