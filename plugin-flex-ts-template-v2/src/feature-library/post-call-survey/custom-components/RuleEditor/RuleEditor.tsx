import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Card } from '@twilio-paste/core/card';
import { Combobox } from '@twilio-paste/core/combobox';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Text } from '@twilio-paste/core/text';
import { Stack } from '@twilio-paste/core/stack';
import { Switch } from '@twilio-paste/core/switch';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { HelpText } from '@twilio-paste/core/help-text';
import { Form, FormControl } from '@twilio-paste/core/form';
import { FC, useEffect, useState } from 'react';

import { RuleItem } from '../../types/RuleItem';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import SurveyService from '../../utils/SurveyService';
import { SurveyItem } from '../../types/SurveyItem';

export interface RuleEditorProps {
  rule: RuleItem;
  surveys: SurveyItem[];
  queueNames: string[];
}

const RuleEditor: FC<RuleEditorProps> = (props) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);

  const [surveyName, setSurveyName] = useState<string>();
  const [queue_name, setQueueName] = useState<string>(props.rule.data.queue_name);
  const [survey_key, setSurveyKey] = useState<string>(props.rule.data.survey_key);
  const [active, setActive] = useState<boolean>(props.rule.data.active);

  const [queueHasError, setQueueHasError] = useState(false);
  const [surveyHasError, setSurveyHasError] = useState(false);
  const [saveConfirmationIsOpen, setSaveConfirmationIsOpen] = useState(false);
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false);

  const toaster = useToaster();

  useEffect(() => {
    const survey = props.surveys.find((s) => s.data.name === surveyName);
    if (survey) setSurveyKey(survey.key);
  }, [props.surveys, surveyName]);

  useEffect(() => {
    setQueueHasError(queue_name === '');
    setSurveyHasError(surveyName === '');
    setIsDirty(
      queue_name !== props.rule.data.queue_name ||
        surveyName !== props.rule.data.survey_key ||
        active !== props.rule.data.active,
    );
  }, [queue_name, surveyName, active, props.rule]);

  useEffect(() => {
    setHasError(queueHasError || surveyHasError);
  }, [queueHasError, surveyHasError]);

  const handleSaveAction = () => {
    setIsProcessing(true);
    SurveyService.saveRule({
      key: props.rule.key,
      data: {
        active,
        queue_name,
        survey_key,
      },
    })
      .then(() => {
        setIsDirty(false);
        setSaveConfirmationIsOpen(false);
        toaster.push({
          message: 'Rule added successfully',
          variant: 'success',
          dismissAfter: 5000,
        });
      })
      .catch((err: any) => {
        console.warn(err);
        toaster.push({
          message: 'Error saving rule',
          variant: 'error',
          dismissAfter: 5000,
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleDeleteAction = () => {
    setIsProcessing(true);
    SurveyService.deleteRule(props.rule.key)
      .then(() => {
        setIsDirty(false);
        setDeleteConfirmationIsOpen(false);
      })
      .catch((err: any) => {
        console.warn(err);
        console.error('NOT IMPL: Catch backend error and show toast');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <Box minWidth={'100%'}>
      <Stack orientation="vertical" spacing="space70">
        <Box alignItems="center" display="flex">
          <Heading as="h2" variant="heading20" marginBottom="space0">
            <span aria-label="survey image" role="img">
              📞
            </span>{' '}
            Activation Rule
          </Heading>
          <Box marginLeft="auto">
            <ButtonGroup>
              <Button variant="destructive_secondary" onClick={() => setDeleteConfirmationIsOpen(true)}>
                Delete Rule
              </Button>
              <Button variant="primary" disabled={hasError || !isDirty} onClick={() => setSaveConfirmationIsOpen(true)}>
                Save Rule
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Paragraph>Create a rule to activate the survey.</Paragraph>

        <Card>
          <Form>
            <FormControl>
              <Combobox
                name="queue_name"
                items={props.queueNames}
                initialSelectedItem={props.rule.data.queue_name}
                labelText="Select a queue"
                required
                aria-describedby="queue_name_help"
                hasError={queueHasError}
                onSelectedItemChange={(changes) => setQueueName(changes.selectedItem)}
              />
              <HelpText variant="default" id="answer_options_help">
                The queue the call task last visited
              </HelpText>
            </FormControl>

            <FormControl>
              <Combobox
                name="survey"
                items={props.surveys.map((s) => s.data.name)}
                labelText="Select a survey"
                required
                aria-describedby="survey_name_help"
                hasError={surveyHasError}
                initialSelectedItem={props.surveys.find((s) => s.key === survey_key)?.data.name}
                onSelectedItemChange={(changes) => setSurveyName(changes.selectedItem)}
              />
              <HelpText variant="default" id="survey_name_help">
                This is the survey that will be used for this queue {` - ${survey_key}`}
              </HelpText>
            </FormControl>

            <FormControl>
              <Switch aria-describedby="rule_active_help" checked={active} onChange={() => setActive(!active)}>
                {active ? 'Active' : 'Inactive'}
              </Switch>

              <HelpText variant="default" id="rule_active_help">
                Determines if queue will be offered the selected survey
              </HelpText>
            </FormControl>
          </Form>
        </Card>

        <ConfirmationModal
          isOpen={saveConfirmationIsOpen}
          isProcessingAction={isProcessing}
          modalHeader={'Save and Activate'}
          modalBody={<Text as="p">Are you sure you wish to save this rule?</Text>}
          actionLabel={'Save'}
          actionIsDestructive={false}
          handleConfirmAction={handleSaveAction}
          handleCancelAction={() => setSaveConfirmationIsOpen(false)}
        />

        <ConfirmationModal
          isOpen={deleteConfirmationIsOpen}
          isProcessingAction={isProcessing}
          modalHeader={'Delete Rule'}
          modalBody={<Text as={'p'}>Are you sure you wish to delete this rule?</Text>}
          actionLabel={'Delete'}
          actionIsDestructive={true}
          handleConfirmAction={handleDeleteAction}
          handleCancelAction={() => setDeleteConfirmationIsOpen(false)}
        />
        <Toaster {...toaster} />
      </Stack>
    </Box>
  );
};
export default RuleEditor;
