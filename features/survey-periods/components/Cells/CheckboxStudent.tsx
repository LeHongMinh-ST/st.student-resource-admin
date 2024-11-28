import { Checkbox } from '@mantine/core';
import { Student } from '@/types';

interface CheckboxStudentProps {
  student: Student;
  onCheck: (id: number) => void;
  onUnCheck: (id: number) => void;
  isChecked: boolean;
}

const CheckboxStudent: React.FC<CheckboxStudentProps> = ({
  student,
  onCheck,
  onUnCheck,
  isChecked,
}) => (
  <Checkbox
    key={`checkbox${student?.id}`}
    aria-label="Select row"
    checked={isChecked}
    disabled={!student?.info?.person_email}
    onChange={(event) => {
      event.target.checked ? onCheck(Number(student?.id)) : onUnCheck(Number(student?.id));
    }}
  />
);

export default CheckboxStudent;
