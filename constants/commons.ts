import { BaseParamsList, MetaResponse, SelectList } from '@/types';
import { roleLabels } from './labels';
import { RoleEnum } from '@/enums';
import Role from '@/enums/role.enum';

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
