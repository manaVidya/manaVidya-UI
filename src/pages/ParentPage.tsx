import { RolePlaceholder } from './AdminPage';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';

export default function ParentPage() {
  return (
    <RolePlaceholder
      role="Parent"
      route="/parent"
      color="#66BB6A"
      Icon={FamilyRestroomOutlinedIcon}
      description="Track your child's attendance, grades, assignments, and school communication."
    />
  );
}
