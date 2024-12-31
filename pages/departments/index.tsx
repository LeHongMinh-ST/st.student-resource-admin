import Role from '@/enums/role.enum';
import DepartmentPage from '@/features/departments';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(DepartmentPage, [Role.Admin]);
