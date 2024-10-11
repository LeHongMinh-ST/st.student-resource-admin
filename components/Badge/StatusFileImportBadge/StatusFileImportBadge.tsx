import React, { useMemo } from 'react';
import { Progress } from '@mantine/core';
import { statusFileImportLabels } from '@/constants/labels';
import { StatusFileImport } from '@/enums';

interface StatusFileImportBadgeProp {
  status: StatusFileImport;
  total_record: number;
  error_record: number;
  handle_record: number;
}

const StatusFileImportBadge: React.FC<StatusFileImportBadgeProp> = ({
  status,
  total_record,
  error_record,
  handle_record,
}) => {
  const getBadgeProps = (status: StatusFileImport) => {
    switch (status) {
      case StatusFileImport.Completed:
        return { color: 'green.8', label: statusFileImportLabels.completed };
      case StatusFileImport.Processing:
        return { color: 'blue', label: statusFileImportLabels.processing };
      case StatusFileImport.Pending:
        return { color: 'gray', label: statusFileImportLabels.pending };
      default:
        return { color: 'green.8', label: statusFileImportLabels.completed };
    }
  };

  const process = useMemo(() => {
    if (status === StatusFileImport.Completed) {
      return 100;
    }
    return 100 * ((error_record + handle_record) / total_record);
  }, [total_record, handle_record, error_record]);

  const badgeProps = getBadgeProps(status);

  return (
    <Progress.Root size="xl">
      <Progress.Section value={process} color={badgeProps.color} animated={process < 100}>
        <Progress.Label color={status === StatusFileImport.Completed ? 'white' : 'black'}>
          {' '}
          {badgeProps.label}
        </Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
};

export default StatusFileImportBadge;
