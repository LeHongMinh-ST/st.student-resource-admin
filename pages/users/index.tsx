import Role from '@/enums/role.enum';
import UserPage from '@/features/users';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(UserPage, [Role.Admin]);
