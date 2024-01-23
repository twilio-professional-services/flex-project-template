import { Template, templates } from '@twilio/flex-ui';
import { Select, Option } from '@twilio-paste/core/select';
import { Label } from '@twilio-paste/core/label';
import { Tr, Th, Td } from '@twilio-paste/core/table';
import { Text } from '@twilio-paste/core/text';

import { stringPrefix } from '../../flex-hooks/strings';

interface OwnProps {
  label: string;
  value: string;
  options: string[];
  onChangeHandler: (value: string) => void;
  disabled: boolean;
}

const AttributeSelect = ({ label, value, options, onChangeHandler, disabled }: OwnProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value !== 'NO_ITEM_SELECTED') onChangeHandler(e.target.value);
  };
  const id = label.replace(' ', '-');
  return (
    <Tr key={id}>
      <Th scope="row" element="WORKER_DETAILS">
        <Label htmlFor={id}>
          <Template source={templates[`${stringPrefix}${label}`]} />
        </Label>
      </Th>
      <Td element="WORKER_DETAILS">
        {disabled ? (
          <Text as="p">{value}</Text>
        ) : (
          <Select value={value} onChange={handleChange} id={id}>
            <Option key="NO_ITEM_SELECTED" value="NO_ITEM_SELECTED" disabled>
              Select {label}
            </Option>
            {options.map((option) => {
              return (
                <Option key={option} value={option}>
                  {option}
                </Option>
              );
            })}
          </Select>
        )}
      </Td>
    </Tr>
  );
};

export default AttributeSelect;
