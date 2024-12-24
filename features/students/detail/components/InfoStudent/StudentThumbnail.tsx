import styled from '@emotion/styled';
import React, { FC, useState } from 'react';
import {
  IconAlertTriangle,
  IconCheck,
  IconEdit,
  IconId,
  IconMail,
  IconUserStar,
  IconX,
} from '@tabler/icons-react';
import { Badge, Box, Paper, Select, Text, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Student } from '@/types';
import { StatusStudentBadge } from '@/components';
import { StudentStatusSelectList } from '@/constants/commons';
import { ChangeStatusStudent, useStudentService } from '@/services/studentService';
import { StudentStatus } from '@/enums';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';
import { warningStatusColor, warningStatusLabel } from '@/constants/labels';
import { WarningStatus } from '@/enums/warningStatus';

type StudentThumbnailProp = {
  className?: string;
  student?: Student;
  mutateStudent?: () => {};
};

const StudentThumbnail: FC<StudentThumbnailProp> = ({ className, student, mutateStudent }) => {
  const [editStatusMode, setEditStatusMode] = useState<boolean>(false);

  const { changeStatusStudent } = useStudentService();
  const handleChangeStatusStudent = (value: string | null) => {
    const data: ChangeStatusStudent = {
      status: value as StudentStatus,
    };

    changeStatusStudent(student?.id ?? '', data).then(() => {
      mutateStudent?.();
      setEditStatusMode(false);
      notifications.show({
        title: 'Thành công!',
        message: 'Cập nhật trạng thái thành công',
        icon: <IconCheck />,
        color: 'green.8',
        autoClose: 5000,
      });
    });
  };
  const { authUser } = useAuthStore();
  return (
    <StudentThumbnailStyled className={className}>
      <Paper p="md" shadow="md" radius="md">
        <div className="student-thumbnail">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={student?.info?.thumbnail ?? ''} alt={student?.code} />
        </div>

        <div className="student-info">
          <Box mt={10}>
            <Text className="mt-2" fw={700} size="xl">
              {student?.last_name} {student?.first_name}
            </Text>
          </Box>
        </div>
        <div className="student-info-list">
          <div className="student-info-item">
            <IconId />
            <Text className="mt-2" fw={500} size="md">
              {student?.code}
            </Text>
          </div>
          <div className="student-info-item">
            <IconMail />
            <Text className="mt-2" fw={500} size="md">
              {student?.email}
            </Text>
          </div>
          <div className="student-info-item">
            <IconUserStar />
            {editStatusMode && authUser?.role === Role.Admin ? (
              <>
                <Select
                  placeholder="Chọn trạng thái"
                  data={StudentStatusSelectList}
                  value={student?.status}
                  onChange={handleChangeStatusStudent}
                />
                <IconX className="cursor-pointer" onClick={() => setEditStatusMode(false)} />
              </>
            ) : (
              <>
                <StatusStudentBadge status={student?.status ?? null} />
                {authUser?.role === Role.Admin && (
                  <IconEdit className="cursor-pointer" onClick={() => setEditStatusMode(true)} />
                )}
              </>
            )}
          </div>
          <div>
            {!!student?.warning_status && student?.warning_status !== WarningStatus.NoWarning && (
              <Badge
                leftSection={<IconAlertTriangle style={{ width: rem(12), height: rem(12) }} />}
                color={warningStatusColor[student?.warning_status]}
                variant="filled"
                size="sm"
                radius="sm"
              >
                {warningStatusLabel[student?.warning_status]}
              </Badge>
            )}
          </div>
        </div>
      </Paper>
    </StudentThumbnailStyled>
  );
};

const StudentThumbnailStyled = styled.div`
  .student-thumbnail {
    display: flex;
    justify-content: center;

    img {
      width: 200px;
      height: auto;
    }
  }

  .student-info {
    text-align: center;
  }

  .student-info-list {
    padding: 10px 20px;

    .student-info-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }
`;

export default StudentThumbnail;
