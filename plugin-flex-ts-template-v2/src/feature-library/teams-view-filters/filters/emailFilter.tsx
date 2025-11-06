import { FilterDefinition, Manager } from '@twilio/flex-ui';

import FreeTextFilter from '../custom-components/FreeTextFilter';
import FreeTextFilterLabel from '../custom-components/FreeTextFilterLabel';
import { StringTemplates } from '../flex-hooks/strings/TeamViewQueueFilter';

/* 
  This filter is based on the model of the worker attributes adopted from
  flex insights.   For a definition of that model see:

  https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data

  The filter does a partial match on the free form typed email string
*/

export const emailFilter = () =>
  ({
    id: 'data.attributes.email',
    fieldName: 'email',
    title: (Manager.getInstance().strings as any)[StringTemplates.EmailAddress],
    customStructure: {
      field: <FreeTextFilter />,
      label: <FreeTextFilterLabel />,
    },
    condition: 'CONTAINS',
  } as FilterDefinition);
