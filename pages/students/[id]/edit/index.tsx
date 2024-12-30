import Role from '@/enums/role.enum';
import StudentEditPage from '@/features/students/edit';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(StudentEditPage, [Role.Admin]);
