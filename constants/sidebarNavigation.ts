import { IconBuilding, IconDashboard } from '@tabler/icons-react';
import { SidebarNavigationProps } from '@/types';

const sidebarNavigationAdmin: SidebarNavigationProps[] = [
  {
    title: 'Tổng quát',
    links: [{ label: 'Bảng điều khiển', icon: IconDashboard, link: '/' }],
  },
  {
    title: 'Quản lý chung',
    links: [{ label: 'Quản lý bộ môn', icon: IconBuilding, link: '/departments' }],
  },
];

export default sidebarNavigationAdmin;
