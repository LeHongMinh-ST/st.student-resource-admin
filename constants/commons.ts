import { ClassType, RoleEnum, StudentStatus } from '@/enums';
import Role from '@/enums/role.enum';
import Status from '@/enums/status.enum';
import { BaseParamsList, MetaResponse, SelectList } from '@/types';
import { classTypeLabels, roleLabels, statusLabels, studentStatusLabels } from './labels';

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
  { value: StudentStatus.TemporarilySuspended, label: studentStatusLabels.temporarily_suspended },
  { value: StudentStatus.Expelled, label: studentStatusLabels.expelled },
  { value: StudentStatus.Deferred, label: studentStatusLabels.deferred },
  { value: StudentStatus.TransferStudy, label: studentStatusLabels.transfer_study },
];

export const StatusList: SelectList<Status>[] = [
  { value: Status.Enable, label: statusLabels.enable },
  { value: Status.Disable, label: statusLabels.disable },
];
