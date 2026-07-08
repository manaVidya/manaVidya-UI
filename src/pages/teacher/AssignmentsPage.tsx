import { Button } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_ASSIGNMENTS } from '../../lib/mockData';

export default function TeacherAssignmentsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Assignments"
        subtitle="Class 5-A"
        action={<Button variant="contained">Create Assignment</Button>}
      />
      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'subject', label: 'Subject' },
          { key: 'dueDate', label: 'Due' },
          { key: 'submissions', label: 'Submissions' },
        ]}
        rows={MOCK_ASSIGNMENTS}
      />
    </PageContainer>
  );
}
