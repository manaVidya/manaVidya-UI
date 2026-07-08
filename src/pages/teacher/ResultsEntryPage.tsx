import { Button } from '@mui/material';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { GradeEntryList } from '../../components/data-display/GradeEntryList';

export default function ResultsEntryPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Results Entry"
        subtitle="Class 5-A · Term 2"
        action={<Button variant="contained">Submit Marks</Button>}
      />
      <GradeEntryList subject="Mathematics" outOf={100} />
    </PageContainer>
  );
}
