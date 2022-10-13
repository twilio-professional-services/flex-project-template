import { FilterDefinition } from "@twilio/flex-ui";

const options = [
  'Acme',
  'Rootechnologies',
  'Fortune Electronics'
];

export const companyFilter = () => ({
  id: 'data.attributes.company',
  title: 'Companies',
  fieldName: 'companies',
  type: 'multiValue',
  options: options.sort().map(value => ({
    value,
    label: value,
    default: false
  })),
  condition: 'IN'
} as FilterDefinition);
