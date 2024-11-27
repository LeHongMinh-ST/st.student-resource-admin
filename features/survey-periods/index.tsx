import styled from '@emotion/styled';
import { Button, Container, Paper, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { IconPlus } from '@tabler/icons-react';
import { CommonDataTable, DeleteModal, PageHeader, StatusBadge } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import { defaultPramsList } from '@/constants/commons';
import StatusEnum from '@/enums/status.enum';
import { dashboardRoute, surveyPeriodRoute } from '@/routes';
import { SurveyPeriod, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { useSurveyPeriodService, SurveyPeriodListParams } from '@/services/surveyPeriodService';
import SurveyPeriodActionMenu from '@/features/survey-periods/components/Cells/SurveyPeriodActionMenu';
import StatusFilter from '@/features/survey-periods/components/Filters/StatusFilter';
import { statusSurveyPeriodLabels } from '@/constants/labels';
import ComfirmModal from '@/components/Modals/ComfirmModel/ComfirmModal';

const SurveyPeriodPage = () => {
  const surveyPeriodService = useSurveyPeriodService();
  const [surveyPeriodParams, setSurveyPeriodParams] = useState<SurveyPeriodListParams>({
    ...defaultPramsList,
  });

  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [isOpenPopupComfirm, { open: onOpenPopupComfirm, close: onClosePopupComfirm }] =
    useDisclosure(false);

  const [selected, setSelected] = useState<SurveyPeriod | null>(null);

  const handleGetListSurveyPeriod = () =>
    surveyPeriodService
      .getList(surveyPeriodParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data, isLoading, mutate } = useSWR<ResultResponse<SurveyPeriod[]>>(
    [surveyPeriodParams],
    handleGetListSurveyPeriod
  );

  const handCopyLinkFormJob = async (surveyPeriod: SurveyPeriod) => {
    // const idEncrypted = encryptedString(surveyPeriod.id?.toString() ?? '');
    // `${window.location.protocol}//${window.location.host}/khao-sat-viec-lam-sinh-vien/${idEncrypted}`

    copyTextToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_STUDENT_URL}/form-job-survey/${surveyPeriod.id?.toString() ?? ''}`
    );
  };

  const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(textArea);
  };

  const columns: DataTableProps<SurveyPeriod>['columns'] = useMemo(
    () => [
      {
        accessor: 'title',
        title: 'Tên đợt khảo sát',
        render: (surveyPeriod: SurveyPeriod) => <span>{surveyPeriod.title}</span>,
        sorting: true,
        filter: (
          <SearchFilter
            label="Tìm kiếm'"
            placeholder="vd: Tên đợt khảo sát..."
            setParams={(value) => {
              setSurveyPeriodParams({
                ...surveyPeriodParams,
                q: value,
              });
            }}
            searchTermValue={surveyPeriodParams.q}
          />
        ),
        filtering: !!surveyPeriodParams.q,
      },
      {
        accessor: 'year',
        title: 'Năm khảo sát',
        render: (surveyPeriod: SurveyPeriod) => <span>{surveyPeriod.year}</span>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'start_date',
        title: 'Bắt đầu',
        render: (surveyPeriod: SurveyPeriod) => (
          <span>{formatDateString(surveyPeriod.start_date, 'HH:MM dd/mm/yyyy')}</span>
        ),
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'end_date',
        title: 'Kết thúc',
        render: (surveyPeriod: SurveyPeriod) => (
          <span>{formatDateString(surveyPeriod.end_date, 'HH:MM dd/mm/yyyy')}</span>
        ),
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        filter: (
          <StatusFilter
            value={surveyPeriodParams.status}
            onChange={(value) =>
              setSurveyPeriodParams({ ...surveyPeriodParams, status: value as StatusEnum })
            }
          />
        ),
        render: (surveyPeriod: SurveyPeriod) => (
          <StatusBadge status={surveyPeriod.status} statusLabels={statusSurveyPeriodLabels} />
        ),
        sorting: true,
        filtering: !!surveyPeriodParams.status,
      },
      {
        accessor: 'report_rate',
        title: 'Phản hồi',
        render: (surveyPeriod: SurveyPeriod) => (
          <Text style={{ textAlign: 'center' }}>
            {surveyPeriod?.total_student_responses ?? ''} / {surveyPeriod?.total_student}
          </Text>
        ),
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (surveyPeriod: SurveyPeriod) => (
          <Text fz="sm">{formatDateString(surveyPeriod?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (surveyPeriod: SurveyPeriod) => (
          <SurveyPeriodActionMenu
            onCopySurveyLink={handCopyLinkFormJob}
            surveyPeriod={surveyPeriod}
            onOpen={onOpen}
            setSelected={setSelected}
            onOpenPopupComfirm={onOpenPopupComfirm}
          />
        ),
      },
    ],
    [authUser?.id, onOpen, setSurveyPeriodParams, surveyPeriodParams.q, surveyPeriodParams.status]
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await surveyPeriodService.deleteSurveyPeriod(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, surveyPeriodService]);

  const handleSendMail = useCallback(async () => {
    if (selected) {
      await surveyPeriodService.sendMailSurveyPeriod(selected?.id ?? '', {
        is_all_mail_student: true,
      });
      await mutate();
      onClosePopupComfirm();
    }
  }, [selected, surveyPeriodService]);

  return (
    <SurveyPeriodPageStyled>
      <DeleteModal
        entityName="đợt khảo sát"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <ComfirmModal
        entityName="phiếu khảo sát"
        onComfirm={handleSendMail}
        isOpen={isOpenPopupComfirm}
        onClose={onClosePopupComfirm}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt khảo sát - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt khảo sát', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={surveyPeriodRoute.create}
                leftSection={<IconPlus size={18} />}
              >
                Tạo mới
              </Button>
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <CommonDataTable
              meta={data?.meta}
              columns={columns}
              records={data?.data}
              fetching={isLoading}
              onPageChange={(page: number) =>
                setSurveyPeriodParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setSurveyPeriodParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </SurveyPeriodPageStyled>
  );
};

const SurveyPeriodPageStyled = styled.div``;

export default SurveyPeriodPage;
