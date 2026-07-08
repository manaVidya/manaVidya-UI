import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ProgressListCard } from '../../components/data-display/ProgressListCard';
import { MOCK_SYLLABUS } from '../../lib/mockData';

export default function ParentSyllabusPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Syllabus"
        subtitle="What's being taught and how far the class has covered it."
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
