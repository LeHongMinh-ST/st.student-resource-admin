import { Badge } from '@mantine/core';
import { roleLabels } from '@/constants/labels';
import Role from '@/enums/role.enum';

interface RoleBadgeProps {
  role?: Role;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeProps = (role: Role | undefined) => {
    if (!role) return { color: 'blue', label: 'Unknown' };
    switch (role) {
      case Role.Admin:
        return { color: 'green.8', label: roleLabels.admin };
      case Role.Office:
        return { color: 'gray', label: roleLabels.office };
      case Role.Teacher:
        return { color: 'blue', label: roleLabels.teacher };
      default:
        return { color: 'blue', label: 'Unknown' };
    }
  };

  const badgeProps = getBadgeProps(role);

  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default RoleBadge;
