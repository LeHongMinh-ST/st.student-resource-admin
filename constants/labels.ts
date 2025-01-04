import {
  ClassType,
  FamilyRelationship,
  Gender,
  RoleEnum,
  StatusEnum,
  StatusFileImport,
  StudentRole,
  StudentStatus,
} from '@/enums';
import SocialPolicyObject from '@/enums/socialPolicyObject.enum';
import StatusSurvey from '@/enums/statusSurvey.enum';
import TrainingType from '@/enums/trainingType.enum';
import { WarningStatus } from '@/enums/warningStatus';

export const statusLabels: Record<StatusEnum, string> = {
  [StatusEnum.Enable]: 'Hoạt động',
  [StatusEnum.Disable]: 'Ẩn',
  [StatusEnum.Draft]: 'Nháp',
};

export const statusSurveyPeriodLabels: {
  [StatusEnum.Enable]: string;
  [StatusEnum.Disable]: string;
} = {
  [StatusEnum.Enable]: 'Hoạt động',
  [StatusEnum.Disable]: 'Huỷ',
};

export const statusSurveyLabels: Record<StatusSurvey, string> = {
  [StatusSurvey.Response]: 'Đã khảo sát',
  [StatusSurvey.Unresponse]: 'Chưa khảo sát',
};

export const statusFileImportLabels: Record<StatusFileImport, string> = {
  [StatusFileImport.Completed]: 'Đã xử lý',
  [StatusFileImport.Processing]: 'Đang xử lý',
  [StatusFileImport.Pending]: 'Chờ xử lý',
};

export const roleLabels: Record<RoleEnum, string> = {
  [RoleEnum.Admin]: 'Ban chủ nhiệm',
  [RoleEnum.Teacher]: 'Giảng viên',
  [RoleEnum.Office]: 'Trợ lý khoa',
};

export const studentRoleLabels: Record<StudentRole, string> = {
  [StudentRole.President]: 'Lớp trưởng',
  [StudentRole.VicePresident]: 'Lớp phóng',
  [StudentRole.Secretary]: 'Bí thư',
  [StudentRole.ViceSecretary]: 'Phó bí thư',
  [StudentRole.Basic]: 'Sinh viên',
};

export const studentStatusLabels: Record<StudentStatus, string> = {
  [StudentStatus.CurrentlyStudying]: 'Đang học',
  [StudentStatus.Graduated]: 'Đã tốt nghiệp',
  [StudentStatus.ToDropOut]: 'Xin thôi học',
  [StudentStatus.TemporarilySuspended]: 'Tạm dừng học',
  [StudentStatus.Expelled]: 'Buộc thôi học',
  [StudentStatus.Deferred]: 'Bảo lưu',
  [StudentStatus.TransferStudy]: 'Chuyển ngành học',
};

export const familyRelationshipLabels: Record<FamilyRelationship, string> = {
  [FamilyRelationship.Father]: 'Bố',
  [FamilyRelationship.Mother]: 'Mẹ',
  [FamilyRelationship.Siblings]: 'Anh/Chị/Em',

  [FamilyRelationship.Grandparent]: 'Ông/Bà',
  [FamilyRelationship.Other]: 'Khác',
};

export const genderLabels: Record<Gender, string> = {
  [Gender.Male]: 'Nam',
  [Gender.Female]: 'Nữ',
  [Gender.Unspecified]: 'Khác',
};

export const trainingTypeLabels: Record<TrainingType, string> = {
  [TrainingType.FormalUniversity]: 'Đại học chính quy',
  [TrainingType.College]: 'Cao đẳng',
  [TrainingType.StudyAndWork]: 'Vừa học vừa làm',
};

export const socialPolicyObjectLabels: Record<SocialPolicyObject, string> = {
  [SocialPolicyObject.None]: 'Không',
  [SocialPolicyObject.SonOfWounded]: 'Con thương binh liệt sĩ',
  [SocialPolicyObject.EspeciallyDifficult]: 'Đối tượng đặc biệt khó khăn',
  [SocialPolicyObject.EthnicMinorityPeopleInTheHighlands]: 'Dân tộc thiểu số ở vùng cao',
  [SocialPolicyObject.DisabledPerson]: 'Người khuyết tật',
};

export const classTypeLabels: Record<ClassType, string> = {
  [ClassType.Basic]: 'Chung',
  [ClassType.Major]: 'Chuyên ngành',
  [ClassType.Subject]: 'Môn học',
};

export const warningStatusLabel: Record<WarningStatus, string> = {
  [WarningStatus.NoWarning]: 'Không có cảnh báo',
  [WarningStatus.UnderObservation]: 'Cảnh báo lần 1',
  [WarningStatus.AtRisk]: 'Cảnh báo lần 2',
};

export const warningStatusColor: Record<WarningStatus, string> = {
  [WarningStatus.NoWarning]: 'orange',
  [WarningStatus.UnderObservation]: 'orange',
  [WarningStatus.AtRisk]: 'red',
};
