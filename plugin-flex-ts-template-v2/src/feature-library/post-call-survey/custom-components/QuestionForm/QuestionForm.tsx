import { Heading } from '@twilio-paste/core/heading';
import { Card } from '@twilio-paste/core/card';
import { Input } from '@twilio-paste/core/input';
import { Combobox } from '@twilio-paste/core/combobox';
import { Form, FormControl, FormActions } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { TextArea } from '@twilio-paste/core/textarea';
import { useUIDSeed } from '@twilio-paste/core/uid-library';
import { FC, useEffect, useState } from 'react';

import { ISurveyQuestion } from '../../types/SurveyQuestion';
import { AnswerOptions } from '../../types/AnswerOptions';
import { answerToTypeMap } from '../../types/AnswerTypes';
import EditButtonGroup from '../EditButtonGroup/EditButtonGroup';

export interface QuestionFormProps {
  isSurveyDirty: boolean;
  isNewSurvey: boolean;
  isEditMode: boolean;
  canAddNew: boolean;
  canDelete: boolean;
  question: ISurveyQuestion;
  index: number;
  handleEditPress: () => void;
  handleAddPress: (index: number) => void;
  handleDeletePress: (index: number) => void;
  handleChange: (index: number, attribute: keyof ISurveyQuestion, value: string | AnswerOptions) => void;
}

const QuestionForm: FC<QuestionFormProps> = (props) => {
  const seed = useUIDSeed();
  const answerOptions = answerToTypeMap.map((a) => a.label);
  const [labelHasError, setLabelHasError] = useState(false);
  const [questionHasError, setQuestionHasError] = useState(false);
  const [answersHasError, setAnswersHasError] = useState(false);

  useEffect(() => {
    setQuestionHasError(props.question.prompt === '');
    setLabelHasError(props.question.label === '');
    setAnswersHasError(props.question.answers === '');
  }, [props.question.prompt, props.question.label, props.question.answers]);

  return (
    <Card>
      <Form aria-labelledby={seed('question-heading')}>
        <Heading as="h3" variant="heading30" marginBottom="space0" id={seed('question-heading')}>
          Question {props.index + 1} {props.question.label && <>{` - ${props.question.label}`}</>}
        </Heading>

        <FormControl>
          <Label htmlFor={seed('reporting_label')} required>
            Short reporting label
          </Label>
          <Input
            aria-describedby="reporting_label_help"
            id="reporting_label"
            name="label"
            type="text"
            placeholder="e.g. CSAT, NPS, Agent Rating"
            onChange={(e) => {
              if (e.target.value.length < 30) props.handleChange(props.index, 'label', e.target.value);
            }}
            required
            readOnly={!props.isEditMode}
            value={props.question.label}
            hasError={labelHasError}
          />
          <HelpText variant="default" id="reporting_label_help">
            This value will be used in Flex Insights as the question label (Max length 30 characters)
          </HelpText>
        </FormControl>

        <FormControl>
          <Label htmlFor={seed('prompt')} required>
            Question text
          </Label>
          <TextArea
            aria-describedby="prompt_help"
            id={seed('prompt')}
            name="prompt"
            required={true}
            readOnly={!props.isEditMode}
            value={props.question.prompt}
            onChange={(e) => props.handleChange(props.index, 'prompt', e.target.value)}
            placeholder="e.g. On a scale from 1 to ... how likely are you to ..."
            hasError={questionHasError}
          />
          <HelpText variant="default" id="prompt_help">
            This text will be read out to the customer via text to speech.
          </HelpText>
        </FormControl>

        <FormControl>
          <Combobox
            name="answer_options"
            items={answerOptions}
            initialSelectedItem={props.question.answers}
            labelText="Select answer options"
            required
            disabled={!props.isEditMode}
            aria-describedby="answer_options_help"
            hasError={answersHasError}
            onSelectedItemChange={(changes) => {
              props.handleChange(props.index, 'answers', changes.selectedItem);

              const answer_options = answerToTypeMap.find((o) => o.label === changes.selectedItem);
              if (answer_options) props.handleChange(props.index, 'answer_options', answer_options?.answers);
            }}
          />
          <HelpText variant="default" id="answer_options_help">
            The allowed options the customer may enter via their phone keypad
          </HelpText>
        </FormControl>

        <FormActions>
          <EditButtonGroup
            canAddNew={props.canAddNew}
            canDelete={props.canDelete}
            isEditing={props.isEditMode}
            handleEditPress={props.handleEditPress}
            handleAddPress={() => props.handleAddPress(props.index)}
            handleDeletePress={() => props.handleDeletePress(props.index)}
          />
        </FormActions>
      </Form>
    </Card>
  );
};

export default QuestionForm;
