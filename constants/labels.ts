import Role from '@/enums/role.enum';
import Status from '@/enums/status.enum';

export const statusLabels: Record<Status, string> = {
  [Status.Enable]: 'Hoạt động',
  [Status.Disable]: 'Ẩn',
  [Status.Draft]: 'Nháp',
};

export const roleLabels: Record<Role, string> = {
  [Role.Admin]: 'Quản trị viên',
  [Role.Teacher]: 'Giảng viên',
  [Role.Officer]: 'Cán bộ khoa',
};
