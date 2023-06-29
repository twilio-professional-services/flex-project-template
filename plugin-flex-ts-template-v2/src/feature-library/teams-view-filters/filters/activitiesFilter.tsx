import { FilterDefinition, Manager, FiltersListItemType } from '@twilio/flex-ui';

import { StringTemplates } from '../flex-hooks/strings/TeamViewQueueFilter';

const activities = Array.from(Manager.getInstance().store.getState().flex.worker.activities);

/* 
  This filter exists solely to provide the ability to translate the title,
  as the one included with Flex is only available in English.
  */

export const activitiesFilter = () =>
  ({
    id: 'data.activity_name',
    title: (Manager.getInstance().strings as any)[StringTemplates.Activities],
    fieldName: 'activity_name',
    options: activities
      ? activities.map((activity: any) => ({
          value: activity[1].name,
          label: activity[1].name,
          default: false,
        }))
      : [],
    type: FiltersListItemType.multiValue,
    condition: 'IN',
  } as FilterDefinition);
