import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';
import { Switch } from '@twilio-paste/core/switch';

interface OwnProps {
  id: string;
  label: string;
  description: string;
  value: boolean;
  enabled: boolean;
  onChangeHandler: (value: boolean) => void;
}

const AttributeBoolean = (props: OwnProps) => {
  const { id, label, description, value, enabled, onChangeHandler } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    onChangeHandler(value);
  };

  return (
    <Tr key={id}>
      <Td element="WORKER_DETAILS">
        <Label htmlFor={id}>{description}</Label>
      </Td>
      <Td element="WORKER_DETAILS">
        <Switch checked={value} onChange={handleChange} disabled={!enabled} id={id} name={label}>
          {label}
        </Switch>
      </Td>
    </Tr>
  );
};

export default AttributeBoolean;
