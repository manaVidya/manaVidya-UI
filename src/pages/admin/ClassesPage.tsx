import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_CLASSES } from '../../lib/mockData';

export default function ClassesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Classes & Sections"
        subtitle="All active classes for the current academic year."
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Class', render: (r) => `${r.name}-${r.section}` },
          { key: 'classTeacher', label: 'Class Teacher' },
          { key: 'studentCount', label: 'Students', align: 'right' },
        ]}
        rows={MOCK_CLASSES}
      />
    </PageContainer>
  );
}
