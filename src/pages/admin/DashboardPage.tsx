import { PortalDashboardPlaceholder } from '../shared/PortalDashboardPlaceholder';

export default function AdminDashboardPage() {
  return (
    <PortalDashboardPlaceholder
      greeting="Admin Dashboard"
      subtitle="Full platform management — users, roles, institutions, analytics and settings."
      stats={[
        { label: 'Total Students', value: '1,284' },
        { label: 'Total Teachers', value: '46' },
        { label: 'Attendance Today', value: '96.2%' },
      ]}
    />
  );
}
