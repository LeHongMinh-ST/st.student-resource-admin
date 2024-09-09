import {
  IconAlertTriangle,
  IconBan,
  IconBook,
  IconBookmark,
  IconBuilding,
  IconDashboard,
  IconListNumbers,
  IconListDetails,
  IconUserEdit,
  IconUsers,
  IconUserStar,
  IconChartDots,
  IconChartBar,
  IconSettings,
  IconBellRinging2,
  IconUser,
} from '@tabler/icons-react';
import { SidebarNavigationProps } from '@/types';

const sidebarNavigationAdmin: SidebarNavigationProps[] = [
  {
    title: 'Quản lý chung',
    links: [
      { label: 'Bảng điều khiển', icon: IconDashboard, link: '/' },
      { label: 'Bộ môn', icon: IconBuilding, link: '/departments' },
      { label: 'Ngành học', icon: IconBookmark, link: '/majors' },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
  {
    title: 'Sinh viên',
    links: [
      { label: 'Thông tin sinh viên', icon: IconUsers, link: '/students' },
      { label: 'Tốt nghiệp', icon: IconUserStar, link: '/students-graduation' },
      { label: 'Cảnh báo', icon: IconAlertTriangle, link: '/students-absent' },
      { label: 'Buộc thôi học', icon: IconBan, link: '/students-leave' },
      { label: 'Phản ánh sinh viên', icon: IconUserEdit, link: '/students-request' },
    ],
  },
  {
    title: 'Khảo sát',
    links: [
      { label: 'Khảo sát viêc làm', icon: IconListDetails, link: '/form-job' },
      { label: 'Đánh giá rèn luyện', icon: IconListNumbers, link: '/form-point' },
    ],
  },
  {
    title: 'Báo cáo - thống kê',
    links: [
      { label: 'Tình hình việc làm', icon: IconChartDots, link: '/statistics-job' },
      { label: 'Báo cáo tổng hợp', icon: IconChartBar, link: '/statistics' },
    ],
  },
  {
    title: 'Hệ thống',
    links: [
      { label: 'Thông báo', icon: IconBellRinging2, link: '/notification' },
      { label: 'Cài đặt', icon: IconSettings, link: '/settings' },
      { label: 'Người dùng', icon: IconUser, link: '/users' },
    ],
  },
];

export default sidebarNavigationAdmin;
