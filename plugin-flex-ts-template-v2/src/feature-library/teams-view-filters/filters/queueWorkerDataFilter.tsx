import { FilterDefinition, Manager } from '@twilio/flex-ui';
import { sortBy } from 'lodash';

import SelectFilter from '../custom-components/SelectFilter';
import SelectFilterLabel from '../custom-components/SelectFilterLabel';
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import { StringTemplates } from '../flex-hooks/strings/TeamViewQueueFilter';

/* 
    this filter only works when a supporting backend solution is keeping
    worker data up-to-date with an array of queue sids that they are eligible
    to work
*/

export const queueWorkerDataFilter = async () => {
  let queueOptions;

  try {
    queueOptions = await TaskRouterService.getQueues();
  } catch (error) {
    console.error('teams-view-filters: Unable to get queues', error);
  }

  const options = queueOptions
    ? queueOptions.map((queue: any) => ({
        value: queue.sid,
        label: queue.friendlyName,
        default: false,
      }))
    : [];

  return {
    id: 'data.attributes.queues',
    title: (Manager.getInstance().strings as any)[StringTemplates.QueueEligibility],
    fieldName: 'queues',
    customStructure: {
      label: <SelectFilterLabel />,
      field: <SelectFilter IsMulti={true} />,
    },
    options: sortBy(options, ['label']),
    condition: 'IN',
  } as FilterDefinition;
};
