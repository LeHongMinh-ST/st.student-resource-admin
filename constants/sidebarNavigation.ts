import {
  IconAlertTriangle,
  IconBan,
  IconBook,
  IconBookmark,
  IconBuilding,
  IconDashboard,
  IconListDetails,
  IconUserEdit,
  IconUsers,
  IconBellRinging2,
  IconUser,
  IconMessageQuestion,
  IconSchool,
} from '@tabler/icons-react';
import { SidebarNavigationProps, User } from '@/types';
import { dashboardRoute, studentRoute, userRoute } from '@/routes';
import Role from '@/enums/role.enum';

export const sidebarNavigationAdmin: SidebarNavigationProps[] = [
  {
    title: 'Quản lý chung',
    links: [
      { label: 'Bảng điều khiển', icon: IconDashboard, link: dashboardRoute.dashboard },
      { label: 'Bộ môn', icon: IconBuilding, link: '/departments' },
      { label: 'Ngành đào tạo', icon: IconBookmark, link: '/training-industries' },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
  {
    title: 'Sinh viên',
    links: [
      { label: 'Danh sách sinh viên', icon: IconUsers, link: studentRoute.listCourse },
      { label: 'Đợt tốt nghiệp', icon: IconSchool, link: '/students-graduation' },
      { label: 'Cảnh báo', icon: IconAlertTriangle, link: '/students-warning' },
      { label: 'Buộc thôi học', icon: IconBan, link: '/students-leave' },
      { label: 'Xác nhận thông tin', icon: IconUserEdit, link: '/students-request' },
      { label: 'Phản ánh', icon: IconMessageQuestion, link: '/students-report' },
    ],
  },
  {
    title: 'Khảo sát',
    links: [
      { label: 'Khảo sát viêc làm', icon: IconListDetails, link: '/survey-periods' },
      // { label: 'Đánh giá rèn luyện', icon: IconListNumbers, link: '/form-point' },
    ],
  },
  // {
  //   title: 'Báo cáo - thống kê',
  //   links: [
  //     { label: 'Tình hình việc làm', icon: IconChartDots, link: '/statistics-job' },
  //     { label: 'Báo cáo tổng hợp', icon: IconChartBar, link: '/statistics' },
  //   ],
  // },
  {
    title: 'Hệ thống',
    links: [
      { label: 'Tài khoản', icon: IconUser, link: userRoute.list },
      // { label: 'Thông báo', icon: IconBellRinging2, link: '/notification' },
      // { label: 'Cài đặt', icon: IconSettings, link: '/settings' },
    ],
  },
];

export const sidebarNavigationOfficer: SidebarNavigationProps[] = [
  {
    title: 'Quản lý chung',
    links: [
      { label: 'Bảng điều khiển', icon: IconDashboard, link: dashboardRoute.dashboard },
      { label: 'Bộ môn', icon: IconBuilding, link: '/departments' },
      { label: 'Ngành học', icon: IconBookmark, link: '/majors' },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
  {
    title: 'Sinh viên',
    links: [
      { label: 'Danh sách sinh viên', icon: IconUsers, link: studentRoute.listCourse },
      { label: 'Cảnh báo', icon: IconAlertTriangle, link: '/students-warning' },
      { label: 'Buộc thôi học', icon: IconBan, link: '/students-leave' },
      { label: 'Xác nhận thông tin', icon: IconUserEdit, link: '/students-request' },
      { label: 'Phản ánh', icon: IconMessageQuestion, link: '/students-report' },
    ],
  },
  {
    title: 'Hệ thống',
    links: [{ label: 'Thông báo', icon: IconBellRinging2, link: '/notification' }],
  },
];

export const sidebarNavigationTeacher: SidebarNavigationProps[] = [
  {
    title: 'Quản lý chung',
    links: [
      { label: 'Bảng điều khiển', icon: IconDashboard, link: dashboardRoute.dashboard },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
  {
    title: 'Sinh viên',
    links: [
      { label: 'Danh sách sinh viên', icon: IconUsers, link: studentRoute.listCourse },
      { label: 'Xác nhận thông tin', icon: IconUserEdit, link: '/students-request' },
      { label: 'Phản ánh', icon: IconMessageQuestion, link: '/students-report' },
    ],
  },
];

export const getSidebar = (user: User): SidebarNavigationProps[] => {
  switch (user.role) {
    case Role.Admin:
      return sidebarNavigationAdmin;
    case Role.Office:
      return sidebarNavigationOfficer;
    case Role.Teacher:
      return sidebarNavigationTeacher;
    default:
      return sidebarNavigationTeacher;
  }
};
