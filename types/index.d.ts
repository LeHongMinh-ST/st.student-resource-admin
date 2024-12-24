import {
  ExcelFileImportType,
  FamilyRelationship,
  Gender,
  SocialPolicyObject,
  StatusEnum,
  StatusFileImport,
  StudentStatus,
  TrainingType,
} from '@/enums';
import Role from '@/enums/role.enum';
import ClassType from '@/enums/classType.enum';
import { WarningStatus } from '@/enums/warningStatus';

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

type ResultResponse<T> = {
  graduation_ceremony_ids: any;
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
  student_count: number;
  currently_studying_count: number;
  created_at?: string;
  updated_at?: string;
};

type ZipExportFile = {
  id?: number;
  name: string;
  file_total: number;
  process_total: number;
  status: StatusFileImport;
  survey_period_id: number;
  survey_period?: SurveyPeriod;
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
//
// type GeneralClass = {
//   id?: number;
//   name: string;
//   code: string;
//   faculty?: Faculty;
//   teacher?: User;
//   sub_teacher?: User;
//   type: string;
//   status: StatusEnum;
//   student_role: StudentRole;
//   teacher_id?: number;
//   sub_teacher_id?: number
//   created_at?: string;
//   updated_at?: string;
// };

type Student = {
  id?: number;
  last_name: string;
  first_name: string;
  full_name?: string;
  email: string;
  code: string;
  current_employment_response?: FormJobSurvey;
  admission_year?: AdmissionYear;
  faculty?: Faculty;
  status: StudentStatus;
  families: family[];
  info?: StudentInfo;
  currentClass: GeneralClass;
  current_survey_period?: StudentSurveyPeriod;
  graduate?: StudentGraduation;
  school_year: string;
  created_at?: string;
  updated_at?: string;
  warning_status?: WarningStatus;
};

export type IOptionCheckbox = {
  value: string[];
  content_other?: string;
};

export type FormJobSurvey = {
  id?: number;
  survey_period_id: number;
  student_id?: number;
  email?: string;
  full_name: string;
  dob?: string;
  gender?: number;
  code_student: string;
  identification_card_number?: string;
  identification_card_number_update?: string;
  identification_issuance_place?: string;
  identification_issuance_date?: string;
  training_industry_id: string;
  training_industry?: TrainingIndustry;
  course: string;
  phone_number?: string;
  employment_status: string;

  // optional
  recruit_partner_name?: string;
  recruit_partner_address?: string;
  recruit_partner_date?: string;
  recruit_partner_position?: string;
  work_area?: number | string;
  city_work_id?: number | string;
  city_work?: City;
  employed_since?: number | string;
  trained_field?: number | string;
  professional_qualification_field?: number | string;
  level_knowledge_acquired?: number | string;
  starting_salary?: string;
  average_income?: number | string;
  job_search_method?: IOptionCheckbox;
  recruitment_type?: IOptionCheckbox;
  soft_skills_required?: IOptionCheckbox;
  must_attended_courses?: IOptionCheckbox;
  solutions_get_job: IOptionCheckbox;
};

type City = {
  id: number;
  name: string;
  code: string;
};

type Family = {
  relationship: FamilyRelationship;
  full_name: string;
  job: string;
  phone: string;
};

type StudentInfo = {
  note?: string;
  person_email?: string;
  gender?: Gender;
  permanent_residence?: string;
  dob?: string;
  pob?: string;
  countryside?: string;
  address?: string;
  training_type?: TrainingType;
  phone?: string;
  nationality?: string;
  citizen_identification?: string;
  ethnic?: string;
  religion?: string;
  thumbnail?: string;
  social_policy_object?: SocialPolicyObject;
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

type TrainingIndustry = {
  id?: number;
  name: string;
  code: string;
  status: StatusEnum;
  created_at?: string;
  updated_at?: string;
  faculty_id?: number;
  faculty?: Faculty;
};

type GeneralClass = {
  id?: number;
  name: string;
  code: string;
  status: StatusEnum;
  type: ClassType;
  created_at?: string;
  updated_at?: string;
  faculty_id?: number;
  major_id?: number;
  teacher_id?: number | string;
  sub_teacher_id?: number | string;
  teacher?: User;
  sub_teacher?: User;
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
  total_student_responses?: number;
  total_student?: number;
  status: StatusEnum;
  year: number;
  type: string;
  start_date?: string;
  end_date?: string;
  faculty_id?: number;
  graduation_ceremonies?: Graduation[];
  graduation_ceremony_ids?: number[];
  created_by?: User;
  updated_by?: User;
  created_at?: string;
  updated_at?: string;
};

type StudentSurveyPeriod = {
  student_id?: number;
  survey_period_id?: number;
  email_survey_send?: string;
  number_mail_send?: number;
  updated_at?: string;
};

type Warning = {
  id?: number;
  name: string;
  semester_id: number | string;
  student_count?: number;
  school_year?: string;
  semester: Semester;
  created_at?: string;
  updated_at?: string;
};

type Quit = {
  id?: number;
  name: string;
  semester: string;
  created_at?: string;
  updated_at?: string;
};

type Semester = {
  id?: number;
  semester: number;
  school_year_id: number;
  school_year: SchoolYear;
};

type SchoolYear = {
  id?: number;
  start_year: string;
  end_year: string;
};
