import { FilterDefinition } from "@twilio/flex-ui";
import SelectFilter from "../custom-components/SelectFilter";
import SelectFilterLabel from "../custom-components/SelectFilterLabel";
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService'

/* 
    this filter works by injecting a temporary placeholder into the filters
    that is then later intercepted

    at time of interception the queue expression is loaded for the identified
    queue and the expression is converted into a filter or set of filters.

    as a result this filter supports only on a subset of queues

    queues must use only AND'd expressions, the inclusion of any OR'd
    expressions will result in a notification to the user and the filter
    will be ignored.

    furthermore the expression can onlyuse the following qualifiers
      HAS|==|EQ|!=|CONTAINS|IN|NOT IN
*/

export const queueNoWorkerDataFilter = async () => {
  
  const queueOptions = await TaskRouterService.getQueues();
  const options = queueOptions? queueOptions.map((queue: any) => ({
    value: queue.friendlyName,
    label: queue.friendlyName,
    default: false
  })) : [];

  return {
    id: 'queue-replacement',
    title: 'Queue Eligibility',
    fieldName: 'queue',
    customStructure: {
      label: <SelectFilterLabel />,
      field: <SelectFilter IsMulti={false}/>,
    },
    options: options,
    condition: 'IN'
  } as FilterDefinition;
}
