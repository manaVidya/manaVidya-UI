import { Chip } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_STUDENTS } from '../../lib/mockData';

export default function StudentsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Students"
        subtitle={`${MOCK_STUDENTS.length} students in Class 5-A shown as an example roster.`}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'class', label: 'Class', render: (r) => `${r.className}-${r.section}` },
          { key: 'rollNo', label: 'Roll No.' },
          {
            key: 'attendancePct',
            label: 'Attendance',
            render: (r) => (
              <Chip
                label={`${r.attendancePct}%`}
                size="small"
                sx={{
                  background:
                    r.attendancePct >= 90
                      ? 'var(--status-success-100)'
                      : 'var(--status-warning-100)',
                  color:
                    r.attendancePct >= 90
                      ? 'var(--status-success-500)'
                      : 'var(--status-warning-500)',
                }}
              />
            ),
          },
          { key: 'guardianPhone', label: 'Guardian Phone' },
        ]}
        rows={MOCK_STUDENTS}
      />
    </PageContainer>
  );
}
