import { Button } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { AttendanceMarkGrid } from '../../components/data-display/AttendanceMarkGrid';

export default function TeacherAttendancePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Attendance"
        subtitle="Class 5-A · Today"
        action={<Button variant="contained">Save Attendance</Button>}
      />
      <AttendanceMarkGrid />
    </PageContainer>
  );
}
