import { RolePlaceholder } from './AdminPage';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

export default function TeacherPage() {
  return (
    <RolePlaceholder
      role="Teacher"
      route="/teacher"
      color="#42A5F5"
      Icon={SchoolOutlinedIcon}
      description="Manage classes, assignments, attendance, grade books and student progress."
    />
  );
}
