import Role from '@/enums/role.enum';
import StudentWarningPage from '@/features/students/warnings';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(StudentWarningPage, [Role.Admin, Role.Office]);
