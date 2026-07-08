import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';

export default function ParentTimetablePage() {
  const { activeChild } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="Timetable"
        subtitle={
          activeChild ? `${activeChild.name}'s weekly class schedule.` : 'Weekly class schedule.'
        }
      />
      <TimetableGrid />
    </PageContainer>
  );
}
