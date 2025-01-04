import Role from '@/enums/role.enum';
import DepartmentCreatePage from '@/features/departments/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(DepartmentCreatePage, [Role.Admin]);
