import { FilterDefinition } from "@twilio/flex-ui";

import SelectFilter from '../custom-components/SelectFilter';
import SelectFilterLabel from '../custom-components/SelectFilterLabel';
import { getDepartmentOptions } from '../index'

/* 
  This filter is based on the model of the worker attibutes adopted from
  flex insights.  For a definition of that model see:

  https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data
  
  The worker department_name may be pushed into the worker object through SSO
  or it may be managed directly in flex using some worker customization
  tool.

  In either case a predefined list of departments needs to be configured so that
  it can be selected from to search the workers with that applied department

  Ideally we would be able to get a unique lit of department_names from a lookup
  but there is no consistent way to do this without a backend solution.

  If building tooling in the solution to allow supervisors the ability
  to edit and apply department name, synconrizing these options should be 
  a consideration.

  */

export const departmentFilter = () => ({
  id: 'data.attributes.department_name',
  title: 'Departments',
  fieldName: 'department_name',
  options: getDepartmentOptions().sort().map(value => ({
    value,
    label: value
  })),
  customStructure: {
    field: <SelectFilter IsMulti={true} />,
    label: <SelectFilterLabel />
  },
  condition: 'IN'
} as FilterDefinition);
