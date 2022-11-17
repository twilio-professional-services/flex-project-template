import { FilterDefinition } from "@twilio/flex-ui";
import SelectFilter from "../custom-components/SelectFilter";
import SelectFilterLabel from "../custom-components/SelectFilterLabel";
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService'

/* 
    this filter only works when a supporting backend solution is keeping
    worker data up-to-date with an array of queue sids that they are eligible
    to work
*/

export const queueWorkerDataFilter = async () => {
  
  const queueOptions = await TaskRouterService.getQueues();
  const options = queueOptions? queueOptions.map((queue: any) => ({
    value: queue.sid,
    label: queue.friendlyName,
    default: false
  })) : [];

  return {
    id: 'data.attributes.queues',
    title: 'Queue Eligibility',
    fieldName: 'queues',
    customStructure: {
      label: <SelectFilterLabel />,
      field: <SelectFilter IsMulti={true}/>,
    },
    options: options,
    condition: 'IN'
  } as FilterDefinition;
}
