import { FilterDefinition } from "@twilio/flex-ui";

const options = [
  'Sales',
  'Support',
  'Returns'
];

export const queueFilter = () => ({
  id: 'data.attributes.queues',
  title: 'Queues',
  fieldName: 'queues',
  type: 'multiValue',
  options: options.sort().map(value => ({
    value,
    label: value,
    default: false
  })),
  condition: 'IN'
} as FilterDefinition);
