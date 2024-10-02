import styled from '@emotion/styled';
import { FC } from 'react';
import { Paper } from '@mantine/core';
import { Student } from '@/types';

type StudentThumbnailProp = {
  className?: string;
  student?: Student;
};

const StudentThumbnail: FC<StudentThumbnailProp> = ({ className }) => (
  <StudentThumbnailStyled className={className}>
    <Paper p="md" shadow="md" radius="md">
      <div className="student-thumbnail">
        {/*<img src={student?.info?.thumbnail} alt={student?.code} />*/}
      </div>
    </Paper>
  </StudentThumbnailStyled>
);

const StudentThumbnailStyled = styled.div`
  .student-thumbnail {
  }
`;

export default StudentThumbnail;
