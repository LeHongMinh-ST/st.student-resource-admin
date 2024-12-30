import Role from '@/enums/role.enum';
import UserUpdatePage from '@/features/users/edit';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(UserUpdatePage, [Role.Admin]);
