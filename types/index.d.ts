import Role from '@/enums/role.enum';

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

type MetaResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ResultResonse<T> = {
  data: T;
  meta?: MetaResponse;
};

type BaseParamsList = {
  limit?: number;
  page?: number;
  q?: string;
  order?: 'asc' | 'desc';
  orderBy?: string;
};

type SelectList<T> = {
  value: T;
  label: string;
};

type SidebarNavigationProps = {
  title: string;
  links: SidebarNavigationLinkProp[];
};

type SidebarNavigationLinkProp = {
  label: string;
  icon: ReactNode;
  link: string;
};

type AdmissionYear = {
  admission_year: string;
  school_year: string;
  student_count: number | string;
  created_at?: string;
  updated_at?: string;
};

type User = {
  id?: number;
  user_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  email?: string;
  email_verified_at?: string | null;
  code?: string | null;
  thumbnail?: string;
  department_id?: number | null;
  role: Role;
  status?: Status;
  created_at?: string;
  updated_at?: string;
};

type Student = {};
