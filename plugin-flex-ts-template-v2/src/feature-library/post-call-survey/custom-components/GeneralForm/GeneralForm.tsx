import { FormActions, Form, FormControl } from '@twilio-paste/core/form';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { TextArea } from '@twilio-paste/core/textarea';
import { HelpText } from '@twilio-paste/core/help-text';
import { FC, useEffect, useState } from 'react';
import { useUIDSeed } from '@twilio-paste/core/dist/uid-library';

import { ISurveyDefinition } from '../../types/SurveyDefinition';
import EditButtonGroup from '../EditButtonGroup/EditButtonGroup';

export interface GeneralFormProps {
  canAddNew: boolean;
  isNewSurvey: boolean;
  isEditMode: boolean;
  isSurveyDirty: boolean;
  survey: ISurveyDefinition;
  handleEditPress: () => void;
  handleAddPress: () => void;
  handleDeletePress: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GeneralForm: FC<GeneralFormProps> = (props) => {
  const seed = useUIDSeed();
  const [nameHasError, setNameHasError] = useState(false);
  const [messageIntroHasError, setMessageIntroHasError] = useState(false);
  const [messageEndHasError, setMessageEndHasError] = useState(false);

  useEffect(() => {
    setNameHasError(props.survey.name === '');
    setMessageIntroHasError(props.survey.message_intro === '');
    setMessageEndHasError(props.survey.message_end === '');
  }, [props.survey.name, props.survey.message_intro, props.survey.message_end]);

  return (
    <Card>
      <Form aria-labelledby={seed('general_heading')}>
        <Heading as="h3" variant="heading30" marginBottom="space0" id={seed('general_heading')}>
          Survey Settings
        </Heading>

        <FormControl>
          <Label htmlFor={seed('survey_name')} required>
            Survey name
          </Label>
          <Input
            aria-describedby="survey_name_help"
            id={seed('survey_name')}
            name="name"
            type="text"
            placeholder="e.g. CSAT, NPS, Agent Rating"
            onChange={props.handleChange}
            required
            readOnly={!props.isEditMode}
            value={props.survey.name}
            hasError={nameHasError}
          />
          <HelpText variant="default" id="survey_name_help">
            This value will be used in Flex Insights as the label for the survey
          </HelpText>
        </FormControl>

        <FormControl>
          <Label htmlFor={seed('message_intro')} required>
            Welcome prompt
          </Label>
          <TextArea
            aria-describedby="message_intro_help"
            id={seed('message_intro')}
            name="message_intro"
            onChange={props.handleChange}
            required={true}
            readOnly={!props.isEditMode}
            value={props.survey.message_intro}
            hasError={messageIntroHasError}
          />
          <HelpText variant="default" id="message_intro_help">
            This text will be read out to the customer via text to speech at the commencement of the survey
          </HelpText>
        </FormControl>

        <FormControl>
          <Label htmlFor={seed('message_end')} required>
            Ending prompt
          </Label>
          <TextArea
            onChange={props.handleChange}
            aria-describedby="message_end_help"
            id={seed('message_end')}
            name="message_end"
            required={true}
            readOnly={!props.isEditMode}
            value={props.survey.message_end}
            hasError={messageEndHasError}
          />
          <HelpText variant="default" id="message_end_help">
            This text will be read out to the customer via text to speech at the conclusion of the survey
          </HelpText>
        </FormControl>

        <FormActions>
          <EditButtonGroup
            canAddNew={props.canAddNew}
            canDelete={true}
            isEditing={props.isEditMode}
            handleEditPress={props.handleEditPress}
            handleAddPress={props.handleAddPress}
            handleDeletePress={props.handleDeletePress}
          />
        </FormActions>
      </Form>
    </Card>
  );
};

export default GeneralForm;
