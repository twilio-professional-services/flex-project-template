import { Label, Tr, Td } from '@twilio-paste/core';

interface OwnProps {
  id: string;
  label: string;
  value: string;
}

const FormRowDisplay = ({ id, label, value }: OwnProps) => {
  return (
    <Tr key={id}>
      <Td>
        <Label htmlFor={id}> {label} </Label>
      </Td>
      <Td>{value}</Td>
    </Tr>
  );
};

export default FormRowDisplay;
