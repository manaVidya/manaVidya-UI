import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { NotificationListCard } from '../../components/data-display/NotificationListCard';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

export default function ParentNotificationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        subtitle="Announcements from the school and your child's teachers."
      />
      <NotificationListCard items={MOCK_NOTIFICATIONS} />
    </PageContainer>
  );
}
