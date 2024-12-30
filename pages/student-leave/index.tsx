import Role from '@/enums/role.enum';
import StudentLeavePage from '@/features/students/quits';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(StudentLeavePage, [Role.Admin, Role.Office]);
