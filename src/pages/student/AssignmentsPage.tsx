import { Button, Chip } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_ASSIGNMENTS } from '../../lib/mockData';

const STATUS_COLOR: Record<string, string> = {
  pending: 'var(--status-warning-500)',
  submitted: 'var(--status-info-500)',
  graded: 'var(--status-success-500)',
};

export default function StudentAssignmentsPage() {
  return (
    <PageContainer>
      <PageHeader title="Assignments" subtitle="Homework due for your class." />
      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'subject', label: 'Subject' },
          { key: 'dueDate', label: 'Due' },
          {
            key: 'status',
            label: 'Status',
            render: (r) => (
              <Chip
                label={r.status}
                size="small"
                sx={{
                  textTransform: 'capitalize',
                  color: STATUS_COLOR[r.status],
                  background: 'var(--bg-surface-2)',
                }}
              />
            ),
          },
          {
            key: 'action',
            label: '',
            render: (r) => (r.status === 'pending' ? <Button size="small">Submit</Button> : null),
          },
        ]}
        rows={MOCK_ASSIGNMENTS}
      />
    </PageContainer>
  );
}
