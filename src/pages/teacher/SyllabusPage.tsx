import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ProgressListCard } from '../../components/data-display/ProgressListCard';
import { MOCK_SYLLABUS } from '../../lib/mockData';

export default function TeacherSyllabusPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Syllabus Tracker"
        subtitle="Mark chapters complete as you teach them — Class 5-A."
      />
      <ProgressListCard
        items={MOCK_SYLLABUS.map((s) => ({
          id: s.subject,
          title: s.subject,
          subtitle: s.topic,
          pct: s.completionPct,
        }))}
      />
    </PageContainer>
  );
}
