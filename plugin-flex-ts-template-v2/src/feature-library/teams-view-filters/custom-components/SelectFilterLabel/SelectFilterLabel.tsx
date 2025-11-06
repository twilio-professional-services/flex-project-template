import { templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/TeamViewQueueFilter';

export type OwnProps = {
  currentValue?: string[];
  activeOption?: any;
};

export const SelectFilterLabel = (props: OwnProps) => {
  let label = templates.FilterItemAny();
  if (props.currentValue && props.currentValue.length === 1) {
    label = templates[StringTemplates.FilterOnly]({ selected: props.activeOption?.label ?? props.currentValue[0] });
  }
  if (props.currentValue && props.currentValue.length > 1) {
    label = templates.FilterItemAmountSelected({ amount: props.currentValue.length });
  }
  return <>{label}</>;
};

export default SelectFilterLabel;
