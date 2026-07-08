import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';

export default function TeacherTimetablePage() {
  return (
    <PageContainer>
      <PageHeader title="My Timetable" subtitle="Your weekly teaching schedule." />
      <TimetableGrid />
    </PageContainer>
  );
}
