import Role from '@/enums/role.enum';
import SurveyPeriodDetailPage from '@/features/survey-periods/detail';
import { withAuth } from '@/hoc/withAuth';

export default withAuth(SurveyPeriodDetailPage, [Role.Admin, Role.Office]);
