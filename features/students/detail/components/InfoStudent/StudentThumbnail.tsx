import styled from '@emotion/styled';
import { FC } from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { Student } from '@/types';

type StudentThumbnailProp = {
  className?: string;
  student?: Student;
};

const StudentThumbnail: FC<StudentThumbnailProp> = ({ className, student }) => (
  <StudentThumbnailStyled className={className}>
    <Paper p="md" shadow="md" radius="md">
      <div className="student-thumbnail">
        <img src={student?.info?.thumbnail} alt={student?.code} />
      </div>
      <div className="student-info">
        <Box mt={10}>
          <Text className="mt-2" fw={700} size="xl">
            {student?.last_name} {student?.first_name}
          </Text>
        </Box>
      </div>
    </Paper>
  </StudentThumbnailStyled>
);

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
`;

export default StudentThumbnail;
