import React from 'react';
import { Badge } from '@mantine/core';
import Status from '@/enums/status.enum';
import { statusLabels as statusLabelsDefault } from '@/constants/labels';

interface StatusBadgeProps {
  status: Status;
  statusLabels?: { [key: string]: string };
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusLabels }) => {
  const getBadgeProps = (status: Status) => {
    statusLabels = statusLabels || statusLabelsDefault;
    switch (status) {
      case Status.Enable:
        return { color: 'green.8', label: statusLabels.enable };
      case Status.Disable:
        return { color: 'red', label: statusLabels.disable };
      case Status.Draft:
        return { color: 'gray', label: statusLabels.draft };
      default:
        return { color: 'blue', label: 'Unknown' };
    }
  };

  const badgeProps = getBadgeProps(status);

  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default StatusBadge;
