import Role from '@/enums/role.enum';
import GraduationDetailPage from '@/features/graduations/detail';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(GraduationDetailPage, [Role.Admin, Role.Office]);
