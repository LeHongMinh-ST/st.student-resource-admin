import Role from '@/enums/role.enum';
import SurveyPeriodUpdatePage from '@/features/survey-periods/edit';

import { withAuth } from '@/hoc/withAuth';

export default withAuth(SurveyPeriodUpdatePage, [Role.Admin, Role.Office]);
