import Role from '@/enums/role.enum';
import SurveyPeriodCreatePage from '@/features/survey-periods/create';

import { withAuth } from '@/hoc/withAuth';

export default withAuth(SurveyPeriodCreatePage, [Role.Admin, Role.Office]);
