import { PortalDashboardPlaceholder } from '../shared/PortalDashboardPlaceholder';

export default function StudentDashboardPage() {
  return (
    <PortalDashboardPlaceholder
      greeting="Student Dashboard"
      subtitle="Your timetable, assignments, results, and the AI study assistant."
      stats={[
        { label: 'Pending Assignments', value: '3' },
        { label: 'My Attendance', value: '91%' },
        { label: 'Next Exam', value: '12 days' },
      ]}
    />
  );
}
