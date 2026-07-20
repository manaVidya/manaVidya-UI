import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';
import { fetchMyTimetable } from '../../lib/timetableApi';

export default function ParentTimetablePage() {
  const { activeChild } = useAuth();

  const {
    data: entries,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['timetable', 'me', 'parent', activeChild?.id],
    queryFn: () => fetchMyTimetable('parent', activeChild!.id),
    enabled: Boolean(activeChild),
  });

  return (
    <PageContainer>
      <PageHeader
        title="Timetable"
        subtitle={
          activeChild ? `${activeChild.name}'s weekly class schedule.` : 'Weekly class schedule.'
        }
      />
      <TimetableGrid
        entries={entries ?? []}
        isPending={isPending || !activeChild}
        isError={isError}
      />
    </PageContainer>
  );
}
