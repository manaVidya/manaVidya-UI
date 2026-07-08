import { useAuth } from '../../hooks/useAuth';
import { PortalDashboardPlaceholder } from '../shared/PortalDashboardPlaceholder';

export default function ParentDashboardPage() {
  const { activeChild } = useAuth();

  return (
    <PortalDashboardPlaceholder
      greeting="Parent Dashboard"
      subtitle={
        activeChild
          ? `Tracking ${activeChild.name}'s attendance, assignments, results, and fees.`
          : "Track your child's attendance, assignments, results, and fees."
      }
      stats={[
        {
          label: `${activeChild?.name.split(' ')[0] ?? "Child's"} Attendance`,
          value: `${activeChild?.attendancePct ?? 94}%`,
        },
        { label: 'Pending Fees', value: '₹2,500' },
        { label: 'Unread Notices', value: '2' },
      ]}
    />
  );
}
