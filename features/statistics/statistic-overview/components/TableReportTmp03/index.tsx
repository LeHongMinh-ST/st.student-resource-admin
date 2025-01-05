import { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Pagination, Skeleton, Text } from '@mantine/core';
import useSWR from 'swr';
import { IconAlertTriangle, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useReportSurveyService } from '@/services/ReportSurveyService';
import { ResultResponse, SurveyPeriod } from '@/types';
import { LIST_OPTION_QUESTION_FORM } from '@/constants/form';
import EmptyTable from '@/components/CommonDataTable/EmptyTable';

type StudentImportTabContentProps = {
  survey?: SurveyPeriod;
};

const TableReportTmp03: FC<StudentImportTabContentProps> = ({ survey }) => {
  const reportSurveyService = useReportSurveyService();

  const handleGetDataReport = () =>
    reportSurveyService
      .getReportTemplate03({
        survey_id: Number(survey?.id),
      })
      .then((res) => res.data)
      .catch((error) => error);
  const { data: dataReport3, isLoading } = useSWR<ResultResponse<any[]>>(
    survey ? [survey, 'dataReport3'] : null,
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
      dataReport3?.data?.map((_item, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {index + 1}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.student_code}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.full_name}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.dob}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.gender}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.identification_card_number}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.training_industry_code}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.phone_number}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.email}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.relation_training}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.relation_training}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.not_relation_training}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.continue_education}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.unemployment}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.work_area_state}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.work_area_private}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.work_area_self}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.work_area_foreign}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.work_cities}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.employed_since_less_than_3_months}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.employed_since_3_to_6_months}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.employed_since_6_to_12_months}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.employed_since_more_than_12_months}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.level_knowledge_acquired_full}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.level_knowledge_acquired_partial}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.level_knowledge_acquired_not}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.last_salary}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.average_income_less_5_million}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.average_income_5_to_10_million}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.average_income_10_to_15_million}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.average_income_than_15_million}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.job_search_method_by_academy}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.job_search_method_by_friend}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.job_search_method_by_self}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.job_search_method_by_create_self}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.job_search_method_other}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_exam}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_contract}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_mobilized}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_recruitment}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_seconded}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.recruitment_type_other}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_communication}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_presenting}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_teamwork}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_report_writing}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_leadership}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_english}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_it}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_international}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.soft_skill_other}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_improve}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_professional}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_it}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_foreign_language}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_management}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.course_studying}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_academy}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_job_exchange}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_training}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_program_update}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_activities}
          </td>
          <td style={{ border: '1px solid #e5e6e7', whiteSpace: 'nowrap', padding: '5px 10px' }}>
            {_item?.solution_other}
          </td>
        </tr>
      )) ?? [],
      20
    );
    setDataItemReport(data[activePage - 1]);
  }, [activePage, survey, dataReport3]);

  const handleDownloadTemplateFileImport = async (): Promise<void> => {
    try {
      const res = await reportSurveyService.downloadReportTemplate03({
        survey_id: Number(survey?.id),
      });
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mau_03_danh_sach_sinh_vien_phan_hoi.xlsx');
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
    <TableReportTmp03Styled>
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
              disabled={!dataReport3?.data}
              onClick={handleDownloadTemplateFileImport}
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
                  ? `DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM ${survey?.year} PHẢN HỒI VỀ TÌNH HÌNH VIỆC LÀM`
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
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Mã SV
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Họ và tên
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '7%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Ngày sinh
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '5%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Giới tính
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '8%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Số căn cước/ CMND
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Ngành đào tạo
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '7%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        SĐT
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Email
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
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
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
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={4}
                      >
                        Thời gian tìm được việc làm sau tốt nghiệp
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={3}
                      >
                        Sinh viên có học được kiến thức, kỹ năng cần thiết từ nhà trường
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        rowSpan={3}
                      >
                        Mức lương khởi điểm/1 tháng (triệu đồng)
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={4}
                      >
                        Mức thu nhập bình quân/1 tháng
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={5}
                      >
                        Hình thức tìm việc làm
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={6}
                      >
                        Hình thức tuyển dụng
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={9}
                      >
                        Kỹ năng mềm cần thiết cho công việc
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={6}
                      >
                        Khóa học đã tham gia sau khi tốt nghiệp để đáp ứng yêu cầu công việc
                      </th>
                      <th
                        className="text-center"
                        style={{ width: '10%', border: '1px solid #e5e6e7' }}
                        colSpan={8}
                      >
                        Giải pháp tăng tỷ lệ sinh viên có việc làm đúng ngành đào tạo
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: '6%', border: '1px solid #e5e6e7' }}
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
                      {LIST_OPTION_QUESTION_FORM[3].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      {LIST_OPTION_QUESTION_FORM[6].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      {LIST_OPTION_QUESTION_FORM[7].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      {LIST_OPTION_QUESTION_FORM[8].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      <th
                        rowSpan={2}
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Hình thức khác
                      </th>
                      {LIST_OPTION_QUESTION_FORM[9].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      <th
                        rowSpan={2}
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Hình thức khác
                      </th>
                      {LIST_OPTION_QUESTION_FORM[10].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      <th
                        rowSpan={2}
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Khác
                      </th>
                      {LIST_OPTION_QUESTION_FORM[11].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      {LIST_OPTION_QUESTION_FORM[12].map((item, index) => (
                        <th
                          rowSpan={2}
                          key={index}
                          className="text-center"
                          style={{ width: '3%', border: '1px solid #e5e6e7' }}
                        >
                          {item.label}
                        </th>
                      ))}
                      <th
                        rowSpan={2}
                        className="text-center"
                        style={{ width: '3%', border: '1px solid #e5e6e7' }}
                      >
                        Giải pháp khác
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
                        <td
                          colSpan={63}
                          style={{
                            border: '1px solid #e5e6e7',
                            textAlign: 'left',
                            paddingLeft: '10px',
                          }}
                        >
                          <EmptyTable />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                {Number(dataReport3?.data?.length) / 20 > 1 && (
                  <Pagination
                    total={Number(dataReport3?.data?.length) / 20}
                    value={activePage}
                    onChange={setPage}
                    mt="sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </TableReportTmp03Styled>
  );
};

const TableReportTmp03Styled = styled.div`
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

export default TableReportTmp03;
