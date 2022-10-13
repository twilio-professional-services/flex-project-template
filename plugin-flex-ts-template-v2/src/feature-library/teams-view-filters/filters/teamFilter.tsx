import { FilterDefinition } from "@twilio/flex-ui";

import MultiSelectFilter from '../custom-components/MultiSelectFilter';
import MultiSelectFilterLabel from '../custom-components/MultiSelectFilterLabel';

const teams = [
  'Blue Team',
  'Red Team',
  'Gold Team',
  'VIP Team',
  'Orange Team',
  'Yellow Team',
  'Green Team',
  'Purple Team',
  'Gray Team'
];

export const teamFilter = () => ({
  id: 'data.attributes.team_name',
  title: 'Teams',
  fieldName: 'teams',
  options: teams.sort().map(value => ({
    value,
    label: value
  })),
  customStructure: {
    field: <MultiSelectFilter />,
    label: <MultiSelectFilterLabel />
  },
  condition: 'IN'
} as FilterDefinition);
