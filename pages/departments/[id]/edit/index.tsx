import Role from '@/enums/role.enum';
import DepartmentUpdatePage from '@/features/departments/edit';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(DepartmentUpdatePage, [Role.Admin]);
