import { PageContainer } from '../../../components/data-display/PageContainer';
import { PageHeader } from '../../../components/data-display/PageHeader';
import { DataTable } from '../../../components/data-display/DataTable';
import { MOCK_EXAM_TIMETABLE } from '../../../lib/mockData';

export default function ExamTimetableBuilderPage() {
  return (
    <PageContainer>
      <PageHeader title="Exam Timetable Builder" subtitle="Term 2 — Annual examination schedule." />
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
