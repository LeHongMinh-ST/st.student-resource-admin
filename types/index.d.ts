import {
  ExcelFileImportType,
  FamilyRelationship,
  Gender,
  SocialPolicyObject,
  StatusEnum,
  StatusFileImport,
  StudentRole,
  StudentStatus,
  TrainingType,
} from '@/enums';
import Role from '@/enums/role.enum';
import ClassType from '@/enums/classType.enum';

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
  icon: ReactuuNode;
  link: string;
};

type AdmissionYear = {
  id?: number;
  admission_year: string;
  school_year: string;
  student_count: number | string;
  created_at?: string;
  updated_at?: string;
};

type ExcelFileImport = {
  id?: number;
  name: string;
  type: ExcelFileImportType;
  total_record: number;
  process_record: number;
  file_errors_count: number;
  status?: StatusFileImport;
  user?: User;
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
  status?: StatusEnum;
  faculty_id?: number | null;
  created_at?: string;
  updated_at?: string;
};

type Faculty = {
  id?: number;
  name: string;
  code: string;
};

type GeneralClass = {
  id?: number;
  name: string;
  code: string;
  faculty?: Faculty;
  teacher?: User;
  type: string;
  status: StatusEnum;
  student_role: StudentRole;
  created_at?: string;
  updated_at?: string;
};

type Student = {
  id?: number;
  last_name: string;
  first_name: string;
  full_name?: string;
  email: string;
  code: string;
  admission_year?: AdmissionYear;
  faculty?: Faculty;
  status: StudentStatus;
  family: Family[];
  info?: StudentInfo;
  currentClass: GeneralClass;
  graduate?: StudentGraduation;
  school_year: string;
  created_at?: string;
  updated_at?: string;
};

type Family = {
  relationship: FamilyRelationship;
  full_name: string;
  job: string;
  phone: string;
};

type StudentInfo = {
  note: string;
  person_email: string;
  gender: Gender;
  permanent_residence: string;
  dob: string;
  pob: string;
  countryside: string;
  address: string;
  training_type: TrainingType;
  phone: string;
  nationality: string;
  citizen_identification: string;
  ethnic: string;
  religion: string;
  thumbnail: string;
  social_policy_object: SocialPolicyObject;
};

type Department = {
  id?: number;
  name: string;
  code: string;
  status: StatusEnum;
  created_at?: string;
  updated_at?: string;
  faculty_id?: number;
  faculty?: Faculty;
};

type Class = {
  id?: number;
  name: string;
  code: string;
  status: StatusEnum;
  type: ClassType;
  created_at?: string;
  updated_at?: string;
  faculty_id?: number;
  major_id?: number;
  teacher_id?: number;
  teacher?: User;
  faculty?: Faculty;
  officer?: {
    student_president?: Student;
    student_secretary?: Student;
  };
};

type Graduation = {
  id?: number;
  name: string;
  certification: string;
  certification_date: string;
  faculty_id?: number;
  faculty?: Faculty;
  year: any;
  student_count?: number;
  created_at?: string;
  updated_at?: string;
};

type StudentGraduation = {
  id?: number;
  student_id: number;
  graduation_id: number;
  gpa: number;
  rank: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

type schoolYear = {
  id?: number;
  start_year: string;
  end_year: string;
  created_at?: string;
  updated_at?: string;
};

type Major = {
  id?: number;
  code: string;
  name: string;
  status: StatusEnum;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

type SurveyPeriod = {
  id?: number;
  title: string;
  description: string;
  status: StatusEnum;
  year: string;
  type: string;
  start_date: string;
  end_date: string;
  faculty_id?: number;
  graduation_ceremony_ids?: number[];
  created_by?: User;
  updated_by?: User;
  created_at?: string;
  updated_at?: string;
};
