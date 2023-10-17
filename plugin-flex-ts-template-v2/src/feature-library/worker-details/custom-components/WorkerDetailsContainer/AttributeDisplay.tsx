import { Template, templates } from '@twilio/flex-ui';
import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';

import { stringPrefix } from '../../flex-hooks/strings';

interface OwnProps {
  id: string;
  label: string;
  value: string;
}

const AttributeDisplay = ({ id, label, value }: OwnProps) => {
  return (
    <Tr key={id}>
      <Td element="WORKER_DETAILS">
        <Label htmlFor={id}>
          <Template source={templates[`${stringPrefix}${label}`]} />
        </Label>
      </Td>
      <Td element="WORKER_DETAILS">{value}</Td>
    </Tr>
  );
};

export default AttributeDisplay;
