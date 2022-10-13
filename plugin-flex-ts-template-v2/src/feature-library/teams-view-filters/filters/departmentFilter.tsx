import { FilterDefinition } from "@twilio/flex-ui";

import MultiSelectFilter from '../custom-components/MultiSelectFilter';
import MultiSelectFilterLabel from '../custom-components/MultiSelectFilterLabel';

const departments = [
  'General Management',
  'Marketing',
  'Operations',
  'Finance',
  'Sales',
  'Human Resources',
  'Purchasing',
  'Customer Service',
  'Recruiting'
];

export const departmentFilter = () => ({
  id: 'data.attributes.department',
  title: 'Departments',
  fieldName: 'departments',
  options: departments.sort().map(value => ({
    value,
    label: value
  })),
  customStructure: {
    field: <MultiSelectFilter />,
    label: <MultiSelectFilterLabel />
  },
  condition: 'IN'
} as FilterDefinition);
