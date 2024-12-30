import Role from '@/enums/role.enum';
import UserCreatePage from '@/features/users/create';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(UserCreatePage, [Role.Admin]);
