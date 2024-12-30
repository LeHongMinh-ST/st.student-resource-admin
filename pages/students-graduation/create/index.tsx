import Role from '@/enums/role.enum';
import GraduationCreatePage from '@/features/graduations/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(GraduationCreatePage, [Role.Admin, Role.Office]);
