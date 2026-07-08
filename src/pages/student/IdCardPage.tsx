import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { IdCardView } from '../../components/data-display/IdCardView';
import { MOCK_STUDENTS } from '../../lib/mockData';

export default function StudentIdCardPage() {
  const { user } = useAuth();
  const self = MOCK_STUDENTS[0];

  return (
    <PageContainer>
      <PageHeader title="ID Card" subtitle="Your school identity card." />
      <IdCardView
        name={user?.name ?? self.name}
        className={self.className}
        section={self.section}
        rollNo={self.rollNo}
        idNumber={`MV-${self.id.toUpperCase()}`}
      />
    </PageContainer>
  );
}
