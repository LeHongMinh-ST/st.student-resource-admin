import { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Pagination, Skeleton, Text } from '@mantine/core';
import useSWR from 'swr';
import { IconAlertTriangle, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useReportSurveyService } from '@/services/ReportSurveyService';
import { ResultResponse, SurveyPeriod } from '@/types';
import EmptyTable from '@/components/CommonDataTable/EmptyTable';

type StudentImportTabContentProps = {
  survey?: SurveyPeriod;
};

const TableReportTmp01: FC<StudentImportTabContentProps> = ({ survey }) => {
  const reportSurveyService = useReportSurveyService();

  const handleGetDataReport = () =>
    reportSurveyService
      .getReportTemplate01({
        survey_id: Number(survey?.id),
      })
      .then((res) => res.data)
      .catch((error) => error);
  const { data: dataReport1, isLoading } = useSWR<ResultResponse<any[]>>(
    survey ? [survey, 'dataReport1'] : null,
    handleGetDataReport
  );

  function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
  }

  const [activePage, setPage] = useState(1);
  const [dataItemReport, setDataItemReport] = useState<any[]>([]);

  useEffect(() => {
    const data = chunk(
      dataReport1?.data?.map((_item, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid #e5e6e7' }}>{index + 1}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.code}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.name}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_student}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_student_female}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_gender}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_female}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.right_training}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.relation_training}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.not_relation_training}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.continue_education}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_unemployment}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>
            {_item?.rate_total_employment_with_total_response}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>
            {_item?.rate_total_employment_with_total_student}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_work_area_state}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_work_area_private}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_work_area_self}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.total_work_are_foreign}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.work_code_cities}</td>
        </tr>
      )) ?? [],
      20
    );
    setDataItemReport(data[activePage - 1]);
  }, [activePage, survey, dataReport1]);

  const handleDownloadTemplateOneFileImport = async (): Promise<void> => {
    try {
      const res = await reportSurveyService.downloadReportTemplate01({
        survey_id: Number(survey?.id),
      });
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mau_01_danh_sach_sinh_vien_phan_hoi.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: 'Lỗi!',
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <TableReportTmp01Styled>
      <Skeleton visible={isLoading}>
        <div className="list-import">
          <div
            className="statistic-job-wrap--body__main"
            id="statisticJobStudent"
            style={{
              margin: '30px 0',
            }}
          >
            <Button
              mb={20}
              disabled={!dataReport1?.data}
              onClick={handleDownloadTemplateOneFileImport}
              leftSection={<IconDownload size={18} />}
            >
              Tải báo cáo
            </Button>
            <div className="main">
              <Text
                style={{
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '24px',
                }}
              >
                {survey
                  ? `BÁO CÁO TÌNH HÌNH VIỆC LÀM CỦA SINH VIÊN TỐT NGHIỆP NĂM ${survey?.year}`
                  : ''}
              </Text>
              <div className="main-table" style={{ overflowX: 'auto' }}>
                <table
                  className="statistic-job-table"
                  style={{ borderCollapse: 'collapse', width: '100%' }}
                >
                  <thead>
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: '2%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        TT
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '6%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Mã ngành
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '15.5%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Tên ngành đào tạo
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '7%', border: '1px solid #e5e6e7' }}
                        colSpan={2}
                      >
                        Số SVTN
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '7%', border: '1px solid #e5e6e7' }}
                        colSpan={2}
                      >
                        Số SV phản hồi
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '15%', border: '1px solid #e5e6e7' }}
                        colSpan={5}
                      >
                        Tình hình việc làm
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '6%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Tỷ lệ có việc làm/ Tổng số SV phản hồi
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '6%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Tỷ lệ có việc làm/ Tổng số SV tốt nghiệp
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '12%', border: '1px solid #e5e6e7' }}
                        colSpan={4}
                      >
                        Khu vực làm việc
                      </th>
                      <th
                        className="text-left"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Nơi làm việc
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Tổng số
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Nữ
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Tổng số
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Nữ
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '9%', border: '1px solid #e5e6e7' }}
                        colSpan={3}
                      >
                        Có việc làm
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Tiếp tục học
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Chưa có việc làm
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Nhà nước
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Tư nhân
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Tự tạo việc làm
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={2}
                      >
                        Có yếu tố nước ngoài
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Đúng ngành ĐT
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Liên quan đến ngành ĐT
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Không liên quan đến ngành ĐT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataItemReport?.length ? (
                      dataItemReport
                    ) : (
                      <tr>
                        <td colSpan={19} style={{ border: '1px solid #e5e6e7' }}>
                          <EmptyTable />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                  {Number(dataReport1?.data?.length) / 20 > 1 && (
                    <Pagination
                      total={Number(dataReport1?.data?.length) / 20}
                      value={activePage}
                      onChange={setPage}
                      mt="sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </TableReportTmp01Styled>
  );
};

const TableReportTmp01Styled = styled.div`
  .main-table {
    .statistic-job-table {
      th {
        font-weight: 600;
        text-align: center;
        padding: 10px 10px;
      }
      td {
        text-align: center;
      }
    }
  }
`;

export default TableReportTmp01;
