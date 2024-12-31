import Role from '@/enums/role.enum';
import QuitCreatePage from '@/features/students/quits/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(QuitCreatePage, [Role.Admin, Role.Office]);
