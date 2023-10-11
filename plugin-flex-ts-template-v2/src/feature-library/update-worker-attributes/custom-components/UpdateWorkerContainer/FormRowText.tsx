import { Input, Label, Tr, Td } from '@twilio-paste/core';

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
        <Label htmlFor={id}> {label} </Label>
      </Td>
      <Td>
        <Input type="text" id={id} value={value} onChange={handleChange} />
      </Td>
    </Tr>
  );
};

export default FormRowText;
