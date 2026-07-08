import { Chip } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { MOCK_CLASS_ATTENDANCE } from '../../lib/mockData';

export default function AttendanceOversightPage() {
  return (
    <PageContainer>
      <PageHeader title="Attendance Oversight" subtitle="Today's attendance across every class." />
      <DataTable
        columns={[
          { key: 'className', label: 'Class', render: (r) => `${r.className}-${r.section}` },
          {
            key: 'presentToday',
            label: 'Present',
            render: (r) => `${r.presentToday} / ${r.totalStudents}`,
          },
          {
            key: 'pct',
            label: '%',
            render: (r) => {
              const pct = Math.round((r.presentToday / r.totalStudents) * 100);
              return (
                <Chip
                  label={`${pct}%`}
                  size="small"
                  sx={{
                    background:
                      pct >= 90 ? 'var(--status-success-100)' : 'var(--status-warning-100)',
                    color: pct >= 90 ? 'var(--status-success-500)' : 'var(--status-warning-500)',
                  }}
                />
              );
            },
          },
        ]}
        rows={MOCK_CLASS_ATTENDANCE}
      />
    </PageContainer>
  );
}
