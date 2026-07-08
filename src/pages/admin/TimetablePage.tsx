import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';

export default function AdminTimetablePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Timetable"
        subtitle="Class 5-A shown as an example — pick any class to view its weekly schedule."
      />
      <TimetableGrid />
    </PageContainer>
  );
}
