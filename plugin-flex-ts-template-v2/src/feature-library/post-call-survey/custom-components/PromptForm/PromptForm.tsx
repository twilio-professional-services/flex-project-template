import { Form, FormControl } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { TextArea } from '@twilio-paste/core/textarea';
import { useUIDSeed } from '@twilio-paste/core/uid-library';
import { FC } from 'react';

export interface PromptFormProps {
  readonly: boolean;
  prompt: string;
}

const PromptForm: FC<PromptFormProps> = (props) => {
  const seed = useUIDSeed();

  return (
    <Form aria-labelledby={seed('address-heading')}>
      <FormControl>
        <Label htmlFor={seed('prompt-text')} required>
          Prompt text
        </Label>
        <TextArea
          aria-describedby="message_help_text"
          id={seed('prompt-text')}
          name="prompt-text"
          required={true}
          readOnly={props.readonly}
          value={props.prompt}
        />
        <HelpText variant="default">This text will be read out to the customer via text to speech.</HelpText>
      </FormControl>
    </Form>
  );
};

export default PromptForm;
