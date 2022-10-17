import { FilterDefinition } from "@twilio/flex-ui";
import SelectFilter from "../custom-components/SelectFilter";
import SelectFilterLabel from "../custom-components/SelectFilterLabel";
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService'

export const queueFilter = async () => {
  
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
