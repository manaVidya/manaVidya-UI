import { Button } from '@mui/material';
import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { MOCK_HALL_TICKETS } from '../../../lib/mockData';

export default function HallTicketGeneratorPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Hall Ticket Generator"
        subtitle="Generated for Term 2 — Annual examinations."
        action={<Button variant="contained">Generate All</Button>}
      />
      <DataTable
        columns={[
          { key: 'studentName', label: 'Student' },
          { key: 'rollNo', label: 'Roll No.' },
          { key: 'examCenter', label: 'Exam Centre' },
          { key: 'seatNo', label: 'Seat No.' },
        ]}
        rows={MOCK_HALL_TICKETS}
      />
    </PageContainer>
  );
}
