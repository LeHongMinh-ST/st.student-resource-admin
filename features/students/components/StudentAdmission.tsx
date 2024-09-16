import { FC } from 'react';
import { AdmissionYear } from '@/types';

type StudentAdmissionProps = {
  admissionYear: AdmissionYear;
};

const StudentAdmission: FC<StudentAdmissionProps> = ({ admissionYear }) => {
  console.log(admissionYear);
  return <>Hello</>;
};

export default StudentAdmission;
