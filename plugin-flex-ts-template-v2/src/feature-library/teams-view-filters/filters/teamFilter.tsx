import { FilterDefinition, Manager } from '@twilio/flex-ui';

import SelectFilter from '../custom-components/SelectFilter';
import SelectFilterLabel from '../custom-components/SelectFilterLabel';
import { getTeamOptions } from '../config';
import { StringTemplates } from '../flex-hooks/strings/TeamViewQueueFilter';

/* 
  This filter is based on the model of the worker attributes adopted from
  flex insights.  For a definition of that model see:

  https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data
  
  The worker team name may be pushed into the worker object through SSO
  or it may be managed directly in flex using some worker customization
  tool.

  In either case a predefined list of teams needs to be configured so that
  it can be selected from to search the workers for matching team names

  Ideally we would be able to get a unique lit of team names from a lookup
  but there is no consistent way to do this without a backend solution.

  If building tooling in the solution to allow supervisors the ability
  to edit and apply team name, synchronizing these options should be 
  a consideration.

  */

export const teamFilter = () =>
  ({
    id: 'data.attributes.team_name',
    title: (Manager.getInstance().strings as any)[StringTemplates.Team],
    fieldName: 'teams',
    options: getTeamOptions()
      .sort()
      .map((value) => ({
        value,
        label: value,
      })),
    customStructure: {
      field: <SelectFilter IsMulti={true} />,
      label: <SelectFilterLabel />,
    },
    condition: 'IN',
  } as FilterDefinition);
