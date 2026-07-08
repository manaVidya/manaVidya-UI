import { Chip } from '@mui/material';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { MOCK_RESULTS } from '../../../lib/mockData';

export default function ConsolidatedResultsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Consolidated Results"
        subtitle="Class 5-A · Term 1 — shown as an example."
      />
      <DataTable
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'marks', label: 'Marks', render: (r) => `${r.marks} / ${r.outOf}` },
          {
            key: 'grade',
            label: 'Grade',
            render: (r) => (
              <Chip
                label={r.grade}
                size="small"
                sx={{
                  background: 'var(--bg-surface-2)',
                  color: 'var(--portal-400)',
                  fontWeight: 700,
                }}
              />
            ),
          },
        ]}
        rows={MOCK_RESULTS.map((r, i) => ({ id: `res-${i}`, ...r }))}
      />
    </PageContainer>
  );
}
