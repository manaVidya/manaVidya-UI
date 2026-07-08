import { PortalDashboardPlaceholder } from '../shared/PortalDashboardPlaceholder';

export default function TeacherDashboardPage() {
  return (
    <PortalDashboardPlaceholder
      greeting="Teacher Dashboard"
      subtitle="Your classes, attendance, gradebook, and syllabus tracking."
      stats={[
        { label: 'My Classes', value: '4' },
        { label: 'Pending Grading', value: '18' },
        { label: "Today's Attendance", value: 'Not marked' },
      ]}
    />
  );
}
