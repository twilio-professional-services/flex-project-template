import { FilterDefinition } from "@twilio/flex-ui";

import FreeTextFilter from '../custom-components/FreeTextFilter';
import FreeTextFilterLabel from '../custom-components/FreeTextFilterLabel';

/* 
  This filter is based on the model of the worker attibutes adopted from
  flex insights.   For a definition of that model see:

  https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data

  The filter does a partial match on the free form typed email string
*/

export const emailFilter = () => ({
  id: 'data.attributes.email',
  fieldName: 'email',
  title: 'Email Address',
  customStructure: {
    field: <FreeTextFilter />,
    label: <FreeTextFilterLabel />
  },
  condition: 'CONTAINS'
}) as FilterDefinition
