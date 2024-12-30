import Role from '@/enums/role.enum';
import StudentPage from '@/features/students';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(StudentPage, [Role.Admin, Role.Office]);
