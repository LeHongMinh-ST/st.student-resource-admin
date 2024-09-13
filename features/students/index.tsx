import { useEffect } from 'react';
import { Container, Stack, Paper } from '@mantine/core';
import styled from '@emotion/styled';
import { dashboardRoute } from '@/routes';
import { PageHeader } from '@/components';
import { useStudentService } from '@/services/studentService';

const StudentPage = () => {
  const { getListAdmission } = useStudentService();

  const handleGetAdmissionYear = () => {
    getListAdmission();
  };

  useEffect(() => {
    handleGetAdmissionYear();
  }, []);

  return (
    <StudentPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Sinh viên - Danh sách khóa sinh viên"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Danh sách khóa sinh viên', href: null },
            ]}
          />

          <Paper p="md" shadow="md" radius="md"></Paper>
        </Stack>
      </Container>
    </StudentPageStyled>
  );
};

const StudentPageStyled = styled.div``;

export default StudentPage;
