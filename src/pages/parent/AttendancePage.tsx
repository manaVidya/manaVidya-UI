import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { AttendanceCalendar } from '../../components/data-display/AttendanceCalendar';

export default function ParentAttendancePage() {
  const { activeChild } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Calendar"
        subtitle={activeChild ? `${activeChild.name}'s attendance record.` : 'Attendance record.'}
      />
      <AttendanceCalendar />
    </PageContainer>
  );
}
