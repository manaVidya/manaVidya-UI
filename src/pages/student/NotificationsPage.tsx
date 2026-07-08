import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { NotificationListCard } from '../../components/data-display/NotificationListCard';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

export default function StudentNotificationsPage() {
  return (
    <PageContainer>
      <PageHeader title="Notifications" subtitle="Announcements from your school and teachers." />
      <NotificationListCard items={MOCK_NOTIFICATIONS} />
    </PageContainer>
  );
}
