import { FilterDefinition } from "@twilio/flex-ui";

import FreeTextFilter from '../custom-components/FreeTextFilter';
import FreeTextFilterLabel from '../custom-components/FreeTextFilterLabel';

export const extensionFilter = {
  id: 'data.attributes.directExtension',
  fieldName: 'directExtension',
  title: 'Extension',
  customStructure: {
    field: <FreeTextFilter />,
    label: <FreeTextFilterLabel />
  },
  condition: 'CONTAINS'
} as FilterDefinition
