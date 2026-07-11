import { useState } from 'react';
import { Button, Chip } from '@mui/material';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { CreateStudentDialog } from '../../components/data-display/CreateStudentDialog';
import { MOCK_STUDENTS, type StudentRow } from '../../lib/mockData';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>(MOCK_STUDENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const handleCreate = (student: StudentRow) => {
    setStudents((prev) => [student, ...prev]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Students"
        subtitle={`${students.length} students on record.`}
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setDialogKey((k) => k + 1);
              setDialogOpen(true);
            }}
          >
            Create Student
          </Button>
        }
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
        rows={students}
      />
      <CreateStudentDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </PageContainer>
  );
}
