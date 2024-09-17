import { StatusFileImport } from '@/enums';
import Role from '@/enums/role.enum';
import Status from '@/enums/status.enum';

export const statusLabels: Record<Status, string> = {
  [Status.Enable]: 'Hoạt động',
  [Status.Disable]: 'Ẩn',
  [Status.Draft]: 'Nháp',
};

export const statusFileImportLabels: Record<StatusFileImport, string> = {
  [StatusFileImport.Completed]: 'Đã xử lý',
  [StatusFileImport.Processing]: 'Đang xử lý',
  [StatusFileImport.Pending]: 'Chờ xử lý',
};

export const roleLabels: Record<Role, string> = {
  [Role.Admin]: 'Quản trị viên',
  [Role.Teacher]: 'Giảng viên',
  [Role.Office]: 'Cán bộ khoa',
};
