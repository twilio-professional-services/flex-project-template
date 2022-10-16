import { FilterDefinition } from "@twilio/flex-ui";

import MultiSelectFilter from '../custom-components/MultiSelectFilter';
import MultiSelectFilterLabel from '../custom-components/MultiSelectFilterLabel';
import { getTeamOptions } from '../index'

/* 
  This filter is based on the model of the worker attibutes adopted from
  flex insights. See https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data for a definition of 
  that model.

  The worker team name may be pushed into the worker object through SSO
  or it may be managed directly in flex using some worker customization
  tool.

  In either case a predefined list of teams needs to be configured so that
  it can be selected from to search the workers for matching team names

  Ideally we would be able to get a unique lit of team names from a lookup
  but there is no consistent way to do this without a backend solution.

  If building tooling in the solution to allow supervisors the ability
  to edit and apply team name, synconrizing these options should be 
  a consideration.

  */

export const teamFilter = () => ({
  id: 'data.attributes.team_name',
  title: 'Team',
  fieldName: 'teams',
  options: getTeamOptions().sort().map(value => ({
    value,
    label: value
  })),
  customStructure: {
    field: <MultiSelectFilter />,
    label: <MultiSelectFilterLabel />
  },
  condition: 'IN'
} as FilterDefinition);
