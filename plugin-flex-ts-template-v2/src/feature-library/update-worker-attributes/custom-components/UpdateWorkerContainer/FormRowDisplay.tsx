import { Template, templates } from '@twilio/flex-ui';
import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';

interface OwnProps {
  id: string;
  label: string;
  value: string;
}

const FormRowDisplay = ({ id, label, value }: OwnProps) => {
  return (
    <Tr key={id}>
      <Td>
        <Label htmlFor={id}>
          <Template source={templates[`PSUpdateWorker${label}`]} />
        </Label>
      </Td>
      <Td>{value}</Td>
    </Tr>
  );
};

export default FormRowDisplay;
