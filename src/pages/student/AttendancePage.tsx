import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { AttendanceCalendar } from '../../components/data-display/AttendanceCalendar';

export default function StudentAttendancePage() {
  return (
    <PageContainer>
      <PageHeader title="My Attendance" subtitle="Your attendance record for this term." />
      <AttendanceCalendar />
    </PageContainer>
  );
}
