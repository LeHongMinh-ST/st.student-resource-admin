import Role from '@/enums/role.enum';
import StatisticOverviewPage from '@/features/statistics/statistic-overview';

import { withAuth } from '@/hoc/withAuth';

export default withAuth(StatisticOverviewPage, [Role.Admin, Role.Office]);
