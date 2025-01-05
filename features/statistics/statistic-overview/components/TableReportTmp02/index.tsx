import { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Pagination, Skeleton, Text } from '@mantine/core';
import useSWR from 'swr';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconDownload } from '@tabler/icons-react';
import { ResultResponse, SurveyPeriod } from '@/types';
import { useReportSurveyService } from '@/services/ReportSurveyService';
import EmptyTable from '@/components/CommonDataTable/EmptyTable';

type StudentImportTabContentProps = {
  survey?: SurveyPeriod;
};

const TableReportTmp02: FC<StudentImportTabContentProps> = ({ survey }) => {
  const reportSurveyService = useReportSurveyService();

  const handleGetDataReport = () =>
    reportSurveyService
      .getReportTemplate02({
        survey_id: Number(survey?.id),
      })
      .then((res) => res.data)
      .catch((error) => error);
  const { data: dataReport2, isLoading } = useSWR<ResultResponse<any[]>>(
    survey ? [survey, 'dataReport2'] : null,
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
      dataReport2?.data?.map((_item, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid #e5e6e7' }}>{index + 1}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.student_code}</td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.full_name}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.gender_female}</td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.identification_card_number}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.training_industry_code}</td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.certification}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.certification_date}</td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.phone_number}
          </td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.email}
          </td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.type_survey}</td>
          <td style={{ border: '1px solid #e5e6e7' }}>{_item?.status_survey}</td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.training_industry_name}
          </td>
          <td style={{ border: '1px solid #e5e6e7', textAlign: 'left', paddingLeft: '10px' }}>
            {_item?.faculty_name}
          </td>
        </tr>
      )) ?? [],
      20
    );
    setDataItemReport(data[activePage - 1]);
  }, [activePage, survey, dataReport2]);

  const handleDownloadTemplateTwoFileImport = async (): Promise<void> => {
    try {
      const res = await reportSurveyService.downloadReportTemplate02({
        survey_id: Number(survey?.id),
      });
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mau_02_danh_sach_sinh_vien_tot_nghiep.xlsx');
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
    <TableReportTmp02Styled>
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
              disabled={!dataReport2?.data}
              onClick={handleDownloadTemplateTwoFileImport}
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
                {survey ? `DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM ${survey?.year}` : ''}
              </Text>
              <div className="main-table" style={{ overflowX: 'auto' }}>
                <table
                  className="statistic-job-table"
                  style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #e5e6e7' }}
                >
                  <thead>
                    <tr>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '2%', border: '1px solid #e5e6e7' }}
                      >
                        TT
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '5%', border: '1px solid #e5e6e7' }}
                      >
                        Mã SV
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '12%', border: '1px solid #e5e6e7' }}
                      >
                        Họ và tên
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '2%', border: '1px solid #e5e6e7' }}
                      >
                        Nữ
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '8%', border: '1px solid #e5e6e7' }}
                      >
                        Số căn cước/ CMND
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '5%', border: '1px solid #e5e6e7' }}
                      >
                        Ngành đào tạo
                      </th>
                      <th
                        className="text-center"
                        colSpan={2}
                        style={{ width: '16%', border: '1px solid #e5e6e7' }}
                      >
                        Quyết định tốt nghiệp
                      </th>
                      <th
                        className="text-center"
                        colSpan={2}
                        style={{ width: '20%', border: '1px solid #e5e6e7' }}
                      >
                        Thông tin liên hệ (điện thoại, email, ...)
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '5%', border: '1px solid #e5e6e7' }}
                      >
                        Hình thức khảo sát
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '2%', border: '1px solid #e5e6e7' }}
                      >
                        Có phản hồi
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                      >
                        Ngành
                      </th>
                      <th
                        className="text-center"
                        rowSpan={2}
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                      >
                        Khoa
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: '8%', border: '1px solid #e5e6e7' }}
                      >
                        Số quyết định
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '8%', border: '1px solid #e5e6e7' }}
                      >
                        Ngày ký quyết định
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '7%', border: '1px solid #e5e6e7' }}
                      >
                        Số điện thoại
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '13%', border: '1px solid #e5e6e7' }}
                      >
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataItemReport?.length ? (
                      dataItemReport
                    ) : (
                      <tr>
                        <td colSpan={14} style={{ border: '1px solid #e5e6e7' }}>
                          <div className="empty-data">
                            <EmptyTable />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
              {Number(dataReport2?.data?.length) / 20 > 1 && (
                <Pagination
                  total={Number(dataReport2?.data?.length) / 20}
                  value={activePage}
                  onChange={setPage}
                  mt="sm"
                />
              )}
            </div>
          </div>
        </div>
      </Skeleton>
    </TableReportTmp02Styled>
  );
};

const TableReportTmp02Styled = styled.div`
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

export default TableReportTmp02;
