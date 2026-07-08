import { Button } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_EXAM_TIMETABLE } from '../../lib/mockData';

export default function StudentExamsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Exams & Hall Ticket"
        subtitle="Term 2 — Annual examinations."
        action={<Button variant="contained">Download Hall Ticket</Button>}
      />
      <DataTable
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' },
          { key: 'room', label: 'Room' },
        ]}
        rows={MOCK_EXAM_TIMETABLE}
      />
    </PageContainer>
  );
}
