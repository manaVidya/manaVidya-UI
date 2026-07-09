import { useState } from 'react';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { CreateTeacherDialog } from '../../components/data-display/CreateTeacherDialog';
import {
  MOCK_TEACHERS,
  toTeacherRow,
  type TeacherProfile,
  type TeacherRow,
} from '../../lib/mockData';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>(MOCK_TEACHERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const handleCreate = (profile: TeacherProfile) => {
    setTeachers((prev) => [toTeacherRow(profile), ...prev]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Teachers"
        subtitle={`${teachers.length} teaching staff on record.`}
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setDialogKey((k) => k + 1);
              setDialogOpen(true);
            }}
          >
            Create Teacher
          </Button>
        }
      />
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'subject', label: 'Subject' },
          { key: 'classesAssigned', label: 'Classes Assigned' },
          { key: 'phone', label: 'Phone' },
        ]}
        rows={teachers}
      />
      <CreateTeacherDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </PageContainer>
  );
}
