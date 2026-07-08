import { Button } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { NotificationListCard } from '../../components/data-display/NotificationListCard';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

export default function AdminNotificationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Notification Center"
        subtitle="Sent to all parents, teachers, and students."
        action={<Button variant="contained">New Notification</Button>}
      />
      <NotificationListCard items={MOCK_NOTIFICATIONS} />
    </PageContainer>
  );
}
