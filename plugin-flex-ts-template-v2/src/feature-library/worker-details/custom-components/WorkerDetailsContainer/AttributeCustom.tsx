import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';

interface OwnProps {
  label: string;
  value: string;
  onChangeHandler: (key: string, value: string) => void;
}

const AttributeCustom = ({ label, value, onChangeHandler }: OwnProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChangeHandler(id, value);
  };
  const id = label.replace(' ', '_');
  return (
    <Tr key={id}>
      <Td element="WORKER_DETAILS">
        <Label htmlFor={id}>{label}</Label>
      </Td>
      <Td element="WORKER_DETAILS">
        <Input type="text" id={id} value={value} onChange={handleChange} />
      </Td>
    </Tr>
  );
};

export default AttributeCustom;
