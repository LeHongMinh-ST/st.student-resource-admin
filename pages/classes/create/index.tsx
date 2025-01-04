import Role from '@/enums/role.enum';
import ClassCreatePage from '@/features/classes/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(ClassCreatePage, [Role.Admin]);
