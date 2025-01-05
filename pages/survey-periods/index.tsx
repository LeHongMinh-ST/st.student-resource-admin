import Role from '@/enums/role.enum';
import SurveyPeriodPage from '@/features/survey-periods';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(SurveyPeriodPage, [Role.Admin, Role.Office]);
