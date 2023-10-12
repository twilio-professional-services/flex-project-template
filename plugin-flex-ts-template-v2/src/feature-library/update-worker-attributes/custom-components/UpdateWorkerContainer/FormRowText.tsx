import { Template, templates } from '@twilio/flex-ui';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';

interface OwnProps {
  id: string;
  label: string;
  value: string;
  onChangeHandler: (value: string) => void;
}

const FormRowText = ({ id, label, value, onChangeHandler }: OwnProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChangeHandler(value);
  };

  return (
    <Tr key={id}>
      <Td>
        <Label htmlFor={id}>
          <Template source={templates[`PSUpdateWorker${label}`]} />
        </Label>
      </Td>
      <Td>
        <Input type="text" id={id} value={value} onChange={handleChange} />
      </Td>
    </Tr>
  );
};

export default FormRowText;
