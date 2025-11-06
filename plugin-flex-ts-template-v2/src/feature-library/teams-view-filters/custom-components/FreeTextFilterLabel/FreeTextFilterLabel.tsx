import { templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/TeamViewQueueFilter';

export type OwnProps = {
  currentValue?: string;
};

export const FreeTextFilterLabel = (props: OwnProps) => (
  <>
    {props.currentValue && props.currentValue.length
      ? templates[StringTemplates.FilterContaining]({ selected: props.currentValue })
      : templates.FilterItemAny()}
  </>
);

export default FreeTextFilterLabel;
