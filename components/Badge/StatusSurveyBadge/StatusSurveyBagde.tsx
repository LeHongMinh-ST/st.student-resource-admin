import { Badge } from '@mantine/core';
import { IconUser, IconUserCog, IconUserStar } from '@tabler/icons-react';
import StudentStatusSurveyPeriod from '@/enums/studentStatusSurvey.enum';
import { Student } from '@/types';

interface StatusSurveyBadgeProps {
  student?: Student;
}

const StatusSurveyBadge: React.FC<StatusSurveyBadgeProps> = ({ student }) => {
  const statusSurvey = student?.current_employment_response?.id
    ? StudentStatusSurveyPeriod.surveyed
    : StudentStatusSurveyPeriod.notSurveyed;
  const getBadgeProps = (statusSurvey: StudentStatusSurveyPeriod | undefined) => {
    if (!statusSurvey) return { color: 'blue', label: 'Unknown' };
    switch (statusSurvey) {
      case StudentStatusSurveyPeriod.surveyed:
        return { color: 'green.8', label: 'Đã khảo sát' };
      case StudentStatusSurveyPeriod.notSurveyed:
        return { color: 'gray', label: 'Chưa khảo sát' };
      default:
        return { color: 'blue', label: 'Unknown' };
    }
  };

  const getIcon = (statusSurvey: StudentStatusSurveyPeriod | undefined) => {
    if (!statusSurvey) return <IconUser size={14} />;
    switch (statusSurvey) {
      case StudentStatusSurveyPeriod.surveyed:
        return <IconUserStar size={14} />;
      case StudentStatusSurveyPeriod.notSurveyed:
        return <IconUserCog size={14} />;
      default:
        return <IconUser size={14} />;
    }
  };

  const badgeProps = getBadgeProps(statusSurvey);

  return (
    <Badge
      leftSection={getIcon(statusSurvey)}
      color={badgeProps.color}
      variant="filled"
      size="md"
      radius="sm"
    >
      {badgeProps.label}
    </Badge>
  );
};

export default StatusSurveyBadge;
