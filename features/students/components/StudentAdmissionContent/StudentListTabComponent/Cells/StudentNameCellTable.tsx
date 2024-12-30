import React, { FC } from 'react';
import { Avatar, Badge, rem, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Student } from '@/types';
import { theme } from '@/theme';
import { WarningStatus } from '@/enums/warningStatus';
import { warningStatusColor, warningStatusLabel } from '@/constants/labels';

type StudentNameCellTableProps = {
  student: Student;
};

const StudentNameCellTable: FC<StudentNameCellTableProps> = ({ student }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar
      variant="filled"
      radius="xl"
      size="md"
      src={student.info?.thumbnail}
      alt={`${student.last_name} ${student.first_name}`}
      color={theme.primaryColor}
    ></Avatar>
    <Stack gap={0}>
      <Text fz="sm" fw={600}>
        {student.last_name} {student.first_name}
        {!!student?.warning_status && student?.warning_status !== WarningStatus.NoWarning && (
          <Badge
            leftSection={<IconAlertTriangle style={{ width: rem(12), height: rem(12) }} />}
            color={warningStatusColor[student?.warning_status as WarningStatus]}
            variant="filled"
            size="sm"
            radius="sm"
          >
            {warningStatusLabel[student?.warning_status as WarningStatus]}
          </Badge>
        )}
      </Text>
      <Text fz="xs">{student.email}</Text>
    </Stack>
  </div>
);

export default StudentNameCellTable;
