import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { TimetableGrid } from '../../components/data-display/TimetableGrid';
import { fetchMyTimetable } from '../../lib/timetableApi';

export default function TeacherTimetablePage() {
  const {
    data: entries,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['timetable', 'me', 'teacher'],
    queryFn: () => fetchMyTimetable('teacher'),
  });

  return (
    <PageContainer>
      <PageHeader title="My Timetable" subtitle="Your weekly teaching schedule." />
      <TimetableGrid entries={entries ?? []} isPending={isPending} isError={isError} />
    </PageContainer>
  );
}
