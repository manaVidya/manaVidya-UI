import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { IdCardView } from '../../components/data-display/IdCardView';

export default function ParentIdCardPage() {
  const { activeChild } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="ID Card"
        subtitle={
          activeChild ? `${activeChild.name}'s school identity card.` : 'Student identity card.'
        }
      />
      {activeChild && (
        <IdCardView
          name={activeChild.name}
          className={activeChild.className}
          section={activeChild.section}
          rollNo={activeChild.rollNo}
          idNumber={`MV-${activeChild.id.toUpperCase()}`}
        />
      )}
    </PageContainer>
  );
}
