import Role from '@/enums/role.enum';
import GraduationPage from '@/features/graduations';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(GraduationPage, [Role.Admin, Role.Office]);
