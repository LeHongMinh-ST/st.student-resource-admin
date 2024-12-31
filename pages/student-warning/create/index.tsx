import Role from '@/enums/role.enum';
import WarningCreatePage from '@/features/students/warnings/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(WarningCreatePage, [Role.Admin, Role.Office]);
