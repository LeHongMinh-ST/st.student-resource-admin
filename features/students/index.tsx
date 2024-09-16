import { useCallback, useEffect, useState } from 'react';
import { Container, Stack, Paper, Card, Text, Group } from '@mantine/core';
import { IconBook2, IconUser } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { dashboardRoute } from '@/routes';
import { PageHeader } from '@/components';
import { useStudentService } from '@/services/studentService';
import { AdmissionYear } from '@/types';
import EmptyTable from '@/components/CommonDataTable/EmptyTable';

const StudentPage = () => {
  const { getListAdmission } = useStudentService();
  const [admissionYear, setAdmissionYear] = useState<AdmissionYear[]>([]);

  const handleGetAdmissionYear = useCallback(async () => {
    try {
      const res = await getListAdmission();
      setAdmissionYear(res.data.data);
    } catch (error) {
      console.log('Failed to get admission year: ', error);
    }
  }, []);

  useEffect(() => {
    handleGetAdmissionYear();
  }, []);

  return (
    <StudentPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Sinh viên - Danh sách khóa học"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Danh sách khóa sinh viên', href: null },
            ]}
          />

          <Paper p="md" shadow="md" radius="md">
            {admissionYear.length > 0 &&
              admissionYear.map((item) => (
                <Card mt={10} className="admission-year-item">
                  <Group align="center" justify="space-between">
                    <Group align="center" mt="md" mb="xs">
                      <IconBook2 size={48} />
                      <div>
                        <Text fw={500} size="xl">
                          Khóa {item.admission_year}
                        </Text>
                        <Text fw={500} size="md" color="gray.6">
                          Năm học: {item.school_year}
                        </Text>
                      </div>
                    </Group>
                    <Group align="center" mt="md" mb="xs">
                      <IconUser size={24} />
                      <Text fw={500} size="lg">
                        Sinh viên: {item.student_count ? item.student_count : 0}
                      </Text>
                    </Group>
                  </Group>
                </Card>
              ))}
            {admissionYear.length === 0 && <EmptyTable />}
          </Paper>
        </Stack>
      </Container>
    </StudentPageStyled>
  );
};

const StudentPageStyled = styled.div`
  .admission-year-item {
    cursor: pointer;
    &:hover {
      background: #f7f7f7;
    }
  }
`;

export default StudentPage;
