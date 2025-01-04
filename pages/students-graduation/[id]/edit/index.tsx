import Role from '@/enums/role.enum';
import GraduationUpdatePage from '@/features/graduations/edit';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(GraduationUpdatePage, [Role.Admin, Role.Office]);
