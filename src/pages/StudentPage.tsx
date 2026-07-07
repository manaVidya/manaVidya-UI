import { RolePlaceholder } from './AdminPage';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

export default function StudentPage() {
  return (
    <RolePlaceholder
      role="Student"
      route="/student"
      color="#FF6584"
      Icon={MenuBookOutlinedIcon}
      description="Access courses, assignments, timetable, results and learning resources."
    />
  );
}
