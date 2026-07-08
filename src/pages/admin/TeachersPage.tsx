import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_TEACHERS } from '../../lib/mockData';

export default function TeachersPage() {
  return (
    <PageContainer>
      <PageHeader title="Teachers" subtitle={`${MOCK_TEACHERS.length} teaching staff on record.`} />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'subject', label: 'Subject' },
          { key: 'classesAssigned', label: 'Classes Assigned' },
          { key: 'phone', label: 'Phone' },
        ]}
        rows={MOCK_TEACHERS}
      />
    </PageContainer>
  );
}
