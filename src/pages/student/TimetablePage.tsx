import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';

export default function StudentTimetablePage() {
  return (
    <PageContainer>
      <PageHeader title="My Timetable" subtitle="Your weekly class schedule." />
      <TimetableGrid />
    </PageContainer>
  );
}
