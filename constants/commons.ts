import {
  ClassType,
  FamilyRelationship,
  Gender,
  RoleEnum,
  SocialPolicyObject,
  StudentStatus,
  TrainingType,
} from '@/enums';
import Role from '@/enums/role.enum';
import Status from '@/enums/status.enum';
import { BaseParamsList, MetaResponse, SelectList } from '@/types';
import {
  classTypeLabels,
  familyRelationshipLabels,
  roleLabels,
  statusLabels,
  statusSurveyLabels,
  statusSurveyPeriodLabels,
  studentStatusLabels,
  trainingTypeLabels,
} from './labels';
import StatusSurvey from '@/enums/statusSurvey.enum';

export const defaultPage: MetaResponse = {
  current_page: 1,
  total: 0,
  per_page: 10,
  last_page: 1,
};

export const defaultPramsList: BaseParamsList = {
  limit: 10,
  page: 1,
};

export const RoleSelectList: SelectList<Role>[] = [
  { value: RoleEnum.Admin, label: roleLabels.admin },
  { value: RoleEnum.Office, label: roleLabels.office },
  { value: RoleEnum.Teacher, label: roleLabels.teacher },
];

export const ClassTypeSelectList: SelectList<ClassType>[] = [
  { value: ClassType.Basic, label: classTypeLabels.basic },
  { value: ClassType.Major, label: classTypeLabels.major },
  { value: ClassType.Subject, label: classTypeLabels.subject },
];

export const StudentStatusSelectList: SelectList<StudentStatus>[] = [
  { value: StudentStatus.CurrentlyStudying, label: studentStatusLabels.currently_studying },
  { value: StudentStatus.Graduated, label: studentStatusLabels.graduated },
  { value: StudentStatus.ToDropOut, label: studentStatusLabels.to_drop_out },
  { value: StudentStatus.TemporarilySuspended, label: studentStatusLabels.temporarily_suspended },
  { value: StudentStatus.Expelled, label: studentStatusLabels.expelled },
  { value: StudentStatus.Deferred, label: studentStatusLabels.deferred },
  { value: StudentStatus.TransferStudy, label: studentStatusLabels.transfer_study },
];

export const StatusList: SelectList<Status>[] = [
  { value: Status.Enable, label: statusLabels.enable },
  { value: Status.Disable, label: statusLabels.disable },
];

export const StatusSurveyList: SelectList<StatusSurvey>[] = [
  { value: StatusSurvey.Response, label: statusSurveyLabels.response },
  { value: StatusSurvey.Unresponse, label: statusSurveyLabels.unresponse },
];

export const StatusListActive: SelectList<Status>[] = [
  { value: Status.Enable, label: statusSurveyPeriodLabels.enable },
  { value: Status.Disable, label: statusSurveyPeriodLabels.disable },
];

export const GenderList: SelectList<Gender>[] = [
  { value: Gender.Male, label: 'Nam' },
  { value: Gender.Female, label: 'Nữ' },
  { value: Gender.Unspecified, label: 'Khác' },
];

export const TrainingTypeList: SelectList<TrainingType>[] = [
  { value: TrainingType.FormalUniversity, label: trainingTypeLabels.formal_university },
  { value: TrainingType.College, label: trainingTypeLabels.college },

  { value: TrainingType.StudyAndWork, label: trainingTypeLabels.study_and_work },
];

export const SocialPolicyObjectList: SelectList<SocialPolicyObject>[] = [
  { value: SocialPolicyObject.None, label: 'Không' },
  { value: SocialPolicyObject.SonOfWounded, label: 'Con thương binh liệt sĩ' },
  { value: SocialPolicyObject.DisabledPerson, label: 'Người khuyết tật' },
  { value: SocialPolicyObject.EspeciallyDifficult, label: 'Đối tượng đặc biệt khó khăn' },
  {
    value: SocialPolicyObject.EthnicMinorityPeopleInTheHighlands,
    label: 'Dân tộc thiểu số ở vùng cao',
  },
];

export const FamilyRelationshipList: SelectList<FamilyRelationship>[] = [
  { value: FamilyRelationship.Father, label: familyRelationshipLabels.father },
  { value: FamilyRelationship.Mother, label: familyRelationshipLabels.mother },
  { value: FamilyRelationship.Siblings, label: familyRelationshipLabels.siblings },
  { value: FamilyRelationship.Grandparent, label: familyRelationshipLabels.grandparent },
  { value: FamilyRelationship.Other, label: familyRelationshipLabels.other },
];

//
