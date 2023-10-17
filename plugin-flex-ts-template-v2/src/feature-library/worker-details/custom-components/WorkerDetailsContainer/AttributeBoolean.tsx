import { Template, templates } from '@twilio/flex-ui';
import { Label } from '@twilio-paste/core/label';
import { Tr, Td } from '@twilio-paste/core/table';
import { Switch } from '@twilio-paste/core/switch';

import { stringPrefix } from '../../flex-hooks/strings';

interface OwnProps {
  id: string;
  label: string;
  value: boolean;
  enabled: boolean;
  onChangeHandler: (value: boolean) => void;
}

const AttributeBoolean = (props: OwnProps) => {
  const { id, label, value, enabled, onChangeHandler } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    onChangeHandler(value);
  };

  return (
    <Tr key={id}>
      <Td>
        <Label htmlFor={id}>
          <Template source={templates[`${stringPrefix}${label}`]} />
        </Label>
      </Td>
      <Td>
        <Switch checked={value} onChange={handleChange} disabled={!enabled} id={id} name={label}>
          {label}
        </Switch>
      </Td>
    </Tr>
  );
};

export default AttributeBoolean;
