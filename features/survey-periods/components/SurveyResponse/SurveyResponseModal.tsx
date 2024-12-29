import { Modal, Text, Card, Checkbox, TextInput, Radio, AspectRatio, Image } from '@mantine/core';
import styled from '@emotion/styled';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FormJobSurvey, SurveyPeriod } from '@/types';
import { LIST_OPTION_QUESTION_FORM } from '@/constants/form';
import { genderLabels } from '@/constants/labels';
import { Gender } from '@/enums';
import '@mantine/dates/styles.css';
import { formatDateString } from '@/utils/func/formatDateString';

type SurveyResponseModalProps = {
  formJobResponse: FormJobSurvey;
  surveyPeriod: SurveyPeriod;
  isOpen: boolean;
  onClose: () => void;
};

const SurveyResponseModal = ({
  formJobResponse,
  surveyPeriod,
  isOpen,
  onClose,
}: SurveyResponseModalProps) => {
  const JobSurveyPageStyled = styled.div`
    background: #e3edfd;
    padding: 20px 20px 20px 20px;

    .form-wrap {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;

      .input-search {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 20px;
        flex-wrap: wrap;

        .mantine-TextInput-root {
          max-width: 400px;
          width: 100%;
        }
      }

      .wrap-header {
        display: flex;
        justify-content: space-between;
        margin: 0 20px 50px 20px;

        .wrap-logo-header {
          display: flex;
          align-items: center;
          width: 40%;
          position: relative;

          .wrap-logo {
            padding-left: 20px;
            width: 65%;
            height: fit-content;
            position: absolute;
          }
        }

        .wrap-info-header {
          width: 60%;
          text-align: center;

          .wrap-title {
            display: flex;
            flex-direction: column;
          }
        }
      }

      .required {
        color: #f95252 !important;
      }

      input.mantine-TextInput-input,
      input.mantine-Select-input,
      .mantine-DatePickerInput-input {
        border-bottom: 1px solid var(--mantine-color-gray-4);
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: unset;
        width: 100%;
      }

      .form-button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
      }
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;

      .copyright {
        color: var(--mantine-color-gray-7);
        font-size: 12px;
      }
    }
  `;

  return (
    <Modal opened={isOpen} onClose={onClose} size="90%" title="Kết quả phản hồi khảo sát">
      <JobSurveyPageStyled>
        <AspectRatio mx="auto" pos="relative">
          <div className="form-wrap">
            <Card shadow="sm" padding="lg" mb="lg">
              <div className="wrap-header">
                <div className="wrap-logo-header">
                  <Image src="/images/logo-vnua.png" alt="logo" className="wrap-logo" />
                </div>
                <div className="wrap-info-header">
                  <div className="wrap-title">
                    <Text size="lg">BỘ NÔNG NGHIỆP</Text>
                    <Text size="lg">VÀ PHÁT TRIỂN NÔNG THÔN</Text>
                    <Text fw={600} size="lg">
                      HỌC VIỆN NÔNG NGHIỆP VIỆT NAM
                    </Text>
                    <Text fw={500} size="lg">
                      Thị trấn Trâu Quỳ, huyện Gia Lâm, thành phố Hà Nội Điện thoại: 024.62617586 -
                      Fax: 024.62617586
                    </Text>
                  </div>
                </div>
              </div>
              <Text fw={700} size="xl" ta="center">
                {surveyPeriod?.title}
              </Text>
              <Text size="sm" my={10}>
                {surveyPeriod?.description}
              </Text>
              <Text mt="xs" size="sm">
                Thời gian khảo sát từ ngày{' '}
                <b>{formatDateString(surveyPeriod?.start_date, 'dd/mm/yyyy')}</b> đến ngày{' '}
                <b>{formatDateString(surveyPeriod?.end_date, 'dd/mm/yyyy')}</b>
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="lg">
                Phần I: Thông tin cá nhân
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                1. Mã sinh viên
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={formJobResponse?.code_student ?? ''}
              />
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                2. Họ và tên
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={formJobResponse?.full_name ?? ''}
                placeholder="vd: Đào Đức Anh"
              />
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                3. Giới tính
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={genderLabels[formJobResponse?.gender as unknown as Gender] ?? ''}
                placeholder="vd: Đào Đức Anh"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                4. Ngày sinh
              </Text>
              <DatePickerInput
                readOnly
                rightSection={
                  <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                }
                placeholder="Chọn ngày sinh"
                locale="vi"
                valueFormat="DD/MM/YYYY"
                defaultValue={formJobResponse?.dob ? new Date(formJobResponse?.dob) : null}
                // value={getValues('dob') ? new Date(getValues('dob') ?? '') : null}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                5. Số căn cước công dân
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                placeholder="vd: 0334********"
                defaultValue={formJobResponse?.identification_card_number ?? ''}
              />
              <>
                <Text fw={600} size="sm" pt={10}>
                  Cập nhập số căn cước công dân (nếu số căn cước công dân hiện tại chưa đúng)
                </Text>
                <TextInput
                  readOnly
                  variant="unstyled"
                  placeholder="vd: 0334********"
                  defaultValue={formJobResponse?.identification_card_number_update ?? ''}
                />
              </>
              <Text fw={600} size="sm" pt={10}>
                Ngày cấp
              </Text>
              <DatePickerInput
                readOnly
                rightSection={
                  <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                }
                locale="vi"
                valueFormat="DD/MM/YYYY"
                defaultValue={
                  formJobResponse?.identification_issuance_date
                    ? new Date(formJobResponse?.identification_issuance_date)
                    : null
                }
              />

              <Text fw={600} size="sm" pt={10}>
                Nơi cấp
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
                defaultValue={formJobResponse?.identification_issuance_place ?? ''}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                6. Khoá học
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={`K${formJobResponse?.code_student?.slice(0, 2) ?? ''}`}
                placeholder="vd: K63"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                7. Tên ngành đào tạo
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={formJobResponse?.training_industry?.name ?? ''}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                8. Điện thoại
              </Text>
              <TextInput readOnly defaultValue={formJobResponse?.phone_number ?? ''} />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                9. Email
              </Text>
              <TextInput readOnly variant="unstyled" defaultValue={formJobResponse?.email ?? ''} />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                10. Anh/chị vui lòng cho biết tình trạng việc làm hiện tại của Anh/Chị
              </Text>
              <Radio.Group defaultValue={String(formJobResponse?.employment_status)}>
                {LIST_OPTION_QUESTION_FORM[1].map((item, index) => (
                  <Radio mt="lg" key={index} value={String(item.value)} label={item.label}></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                11. Tên đơn vị tuyển dụng
              </Text>
              <TextInput
                readOnly
                defaultValue={formJobResponse?.recruit_partner_name ?? ''}
                variant="unstyled"
                placeholder="vd: công ty TNHH A"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                12. Địa chỉ đơn vị
              </Text>
              <TextInput
                readOnly
                defaultValue={formJobResponse?.recruit_partner_address ?? ''}
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
              />
              <Text fw={600} size="sm" pt={20}>
                Địa chỉ đơn vị thuộc Tỉnh/Thành phố
              </Text>
              <TextInput
                readOnly
                defaultValue={formJobResponse?.city_work?.name ?? ''}
                placeholder="Chọn tỉnh/Thành phố"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                13. Thời gian tuyển dụng
              </Text>
              <TextInput
                readOnly
                defaultValue={
                  formJobResponse?.recruit_partner_date
                    ? dayjs(formJobResponse?.recruit_partner_date).format('DD/MM/YYYY')
                    : ''
                }
                variant="unstyled"
                placeholder="vd: 2021"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                14. Chức vụ, vị trí việc làm
              </Text>
              <TextInput
                readOnly
                defaultValue={formJobResponse?.recruit_partner_position ?? ''}
                variant="unstyled"
                placeholder="vd: Trưởng phòng sale"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="lg">
                Phần II: Nội dung khảo sát
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                15. Đơn vị Anh/Chị đang làm việc thuộc khu vực làm việc nào?
              </Text>
              <Radio.Group
                value={String(formJobResponse.work_area) as unknown as string} // Make sure to add this key in your form state
              >
                {LIST_OPTION_QUESTION_FORM[2].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                16. Sau khi tốt nghiệp, Anh/Chị có việc làm từ khi nào?
              </Text>
              <Radio.Group
                value={
                  formJobResponse.employed_since
                    ? String(formJobResponse.employed_since)
                    : undefined
                }
              >
                {LIST_OPTION_QUESTION_FORM[3].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                17. Công việc Anh/Chị đang đảm nhận có phù hợp với ngành được đào tạo không?
              </Text>
              <Radio.Group
                value={
                  String(formJobResponse.professional_qualification_field) as unknown as string
                }
              >
                {LIST_OPTION_QUESTION_FORM[4].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                18. Công việc Anh/Chị đang đảm nhận có phù hợp với trình độ chuyên môn không?
              </Text>
              <Radio.Group
                value={
                  String(formJobResponse.professional_qualification_field) as unknown as string
                }
              >
                {LIST_OPTION_QUESTION_FORM[5].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                19. Anh/chị có học được các kiến thức và kỹ năng cần thiết từ nhà trường cho công
                việc theo ngành tốt nghiệp không?
              </Text>
              <Radio.Group
                value={
                  String(formJobResponse.professional_qualification_field) as unknown as string
                }
              >
                {LIST_OPTION_QUESTION_FORM[6].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                20. Mức lương khởi điểm của Anh/Chị (đơn vị triệu đồng/1 tháng)
              </Text>
              <TextInput
                readOnly
                defaultValue={formJobResponse?.starting_salary ?? ''}
                variant="unstyled"
                placeholder="15"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                21. Mức thu nhập bình quân/tháng tính theo VNĐ của Anh/Chị hiện nay?
              </Text>
              <Radio.Group value={String(formJobResponse?.average_income) as unknown as string}>
                {LIST_OPTION_QUESTION_FORM[7].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                22. Anh/Chị tìm được việc làm thông qua những hình thức nào? (Có thể có nhiều lựa
                chọn)
              </Text>
              <Checkbox.Group value={formJobResponse?.job_search_method?.value}>
                {LIST_OPTION_QUESTION_FORM[8].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {formJobResponse?.job_search_method?.value?.includes('0') && (
                  <TextInput
                    readOnly
                    mt="sm"
                    variant="unstyled"
                    value={formJobResponse.job_search_method?.content_other}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                23. Anh/chị được tuyển dụng theo hình thức nào?
              </Text>
              <Radio.Group value={formJobResponse?.recruitment_type?.value?.[0]}>
                {LIST_OPTION_QUESTION_FORM[9].map((item, index) => (
                  <Radio mt="lg" key={index} value={String(item.value)} label={item.label}></Radio>
                ))}
                <Radio mt="lg" value="0" label="Khác"></Radio>
                {formJobResponse?.recruitment_type?.value?.includes('0') && (
                  <TextInput
                    readOnly
                    mt="sm"
                    variant="unstyled"
                    value={formJobResponse.recruitment_type?.content_other}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                24. Trong quá trình làm việc, Anh/Chị cần những kỹ năng mềm nào sau đây?
              </Text>
              <Checkbox.Group value={formJobResponse?.soft_skills_required?.value}>
                {LIST_OPTION_QUESTION_FORM[10].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {formJobResponse?.soft_skills_required?.value?.includes('0') && (
                  <TextInput
                    readOnly
                    mt="sm"
                    variant="unstyled"
                    value={formJobResponse?.soft_skills_required?.content_other}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                25. Sau khi được tuyển dụng, Anh/Chị có phải tham gia khóa học nâng cao nào dưới đây
                để đáp ứng công việc không?
              </Text>
              <Checkbox.Group value={formJobResponse?.must_attended_courses?.value}>
                {LIST_OPTION_QUESTION_FORM[11].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {formJobResponse?.must_attended_courses?.value?.includes('0') && (
                  <TextInput
                    readOnly
                    mt="sm"
                    variant="unstyled"
                    value={formJobResponse?.must_attended_courses?.content_other}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                26. Theo Anh/Chị, những giải pháp nào sau đây giúp tăng tỷ lệ có việc làm đúng ngành
                của sinh viên tốt nghiệp từ chương trình đào tạo mà Anh/Chị đã học?
              </Text>
              <Checkbox.Group value={formJobResponse?.solutions_get_job?.value}>
                {LIST_OPTION_QUESTION_FORM[12]?.map((item, index) => (
                  <Checkbox
                    key={index}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {formJobResponse?.solutions_get_job?.value?.includes('0') && (
                  <TextInput
                    readOnly
                    mt="sm"
                    variant="unstyled"
                    value={formJobResponse?.solutions_get_job?.content_other}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            {/* )} */}
          </div>
        </AspectRatio>
      </JobSurveyPageStyled>
    </Modal>
  );
};

export default SurveyResponseModal;
