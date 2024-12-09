import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Text } from '@twilio-paste/core/text';
import { Stack } from '@twilio-paste/core/stack';
import { Toaster, useToaster } from '@twilio-paste/core/toast';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@twilio-paste/core/tabs';
import { FC, useEffect, useState } from 'react';

import { AnswerOptions } from '../../types/AnswerOptions';
import { ISurveyQuestion, SurveyQuestion } from '../../types/SurveyQuestion';
import { ISurveyDefinition } from '../../types/SurveyDefinition';
import { SurveyItem } from '../../types/SurveyItem';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import SurveyService from '../../utils/SurveyService';
import GeneralForm from '../GeneralForm/GeneralForm';
import QuestionForm from '../QuestionForm/QuestionForm';
import { useDesignerTabState } from '../../utils/Hooks';

export interface SurveyDesignerProps {
  survey: SurveyItem;
  isNewSurvey: boolean;
  handleHomePress: () => void;
}

const SurveyDesigner: FC<SurveyDesignerProps> = (props) => {
  const [surveyDefinition, setSurveyDefinition] = useState<ISurveyDefinition>(props.survey.data);

  const tabState = useDesignerTabState();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(props.isNewSurvey || false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [saveConfirmationIsOpen, setSaveConfirmationIsOpen] = useState(false);
  const [deleteSurveyConfirmationIsOpen, setDeleteSurveyConfirmationIsOpen] = useState(false);
  const [deleteQuestionConfirmationIsOpen, setDeleteQuestionConfirmationIsOpen] = useState(false);

  const [editConfirmationIsOpen, setEditConfirmationIsOpen] = useState(false);

  const toaster = useToaster();

  useEffect(() => {
    setHasError(false);
    if (surveyDefinition.name === '' || surveyDefinition.message_intro === '' || surveyDefinition.message_end === '')
      setHasError(true);
    surveyDefinition.questions.forEach((q) => {
      if (q.label === '' || q.prompt === '' || q.answers === '') setHasError(true);
    });
  }, [surveyDefinition]);

  const handleNewQuestion = () => {
    setSurveyDefinition((prev) => {
      const newSurvey = { ...prev };
      newSurvey.questions.push(new SurveyQuestion());
      return newSurvey;
    });
  };

  const handleEditPress = () => {
    console.log('Editing general question');
    setEditConfirmationIsOpen(true);
  };

  const handleEditAction = () => {
    setEditConfirmationIsOpen(false);
    setIsEditMode(true);
  };

  const handleDeleteSurveyAction = () => {
    setIsProcessing(true);
    SurveyService.deleteSurvey(props.survey.key)
      .then(() => {
        setIsDirty(false);
        setDeleteSurveyConfirmationIsOpen(false);
        toaster.push({
          message: 'Survey deleted successfully',
          variant: 'success',
          dismissAfter: 5000,
        });
      })
      .catch((err: any) => {
        console.warn(err);
        toaster.push({
          message: 'Error deleting survey, please check logs and check logs',
          variant: 'error',
          dismissAfter: 5000,
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleDeleteQuestionPress = (index: number) => {
    setCurrentQuestion(index);
    setDeleteQuestionConfirmationIsOpen(true);
  };

  const handleDeleteQuestionAction = (index: number) => {
    setDeleteQuestionConfirmationIsOpen(false);
    setIsDirty(true);
    setSurveyDefinition((prev) => {
      const target: ISurveyDefinition = { ...prev };
      const newQuestions = target.questions.filter((v, idx) => idx !== index);
      target.questions = newQuestions;
      return target;
    });
  };

  const handleSaveAction = () => {
    setIsProcessing(true);
    SurveyService.saveSurvey(props.survey.key, surveyDefinition)
      .then(() => {
        setIsDirty(false);
        setSaveConfirmationIsOpen(false);
        toaster.push({
          message: 'Survey saved successfully',
          variant: 'success',
          dismissAfter: 5000,
        });
      })
      .catch((err) => {
        console.warn(err);
        toaster.push({
          message: 'Error saving survey, please check logs and check logs',
          variant: 'error',
          dismissAfter: 5000,
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSurveyDefinition((prev) => {
      return { ...prev, [name]: value };
    });
    setIsDirty(true);
  };

  const handleQuestionChange = (index: number, attribute: keyof ISurveyQuestion, value: string | AnswerOptions) => {
    setSurveyDefinition((prev) => {
      const target: ISurveyDefinition = { ...prev };

      if (attribute === 'answer_options') {
        target.questions[index][attribute] = value as AnswerOptions;
      } else {
        target.questions[index][attribute] = value as string;
      }
      return target;
    });
    setIsDirty(true);
  };

  return (
    <Stack orientation="vertical" spacing="space70">
      <Box alignItems="center" display="flex">
        <Heading as="h2" variant="heading20" marginBottom="space0">
          <span aria-label="survey image" role="img">
            📞
          </span>{' '}
          {surveyDefinition.name || '(Survey name not set)'}
        </Heading>
        <Box marginLeft="auto">
          <Button variant="primary" disabled={hasError || !isDirty} onClick={() => setSaveConfirmationIsOpen(true)}>
            Save Survey
          </Button>
        </Box>
      </Box>
      <Paragraph>
        Customer feedback is super important! These surveys will be played to customers at the end of the call once the
        agent presses the hang up button. Keep the questions to as few as possible and think hard about the words you
        use to request feedback. combinations. Go ahead, add your own.
      </Paragraph>

      <Tabs orientation="vertical" state={tabState}>
        <TabList aria-label="Vertical product tabs">
          <Tab id={'tab-general'}>General</Tab>
          {surveyDefinition.questions.map((q, idx) => (
            <Tab key={`survey-designer-tab-${idx}`} id={`survey-designer-tab-${idx}`}>
              Question {idx + 1}
              {q.label && (
                <Text as={'p'} fontSize={'fontSize20'}>
                  {q.label}
                </Text>
              )}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel tabId={'tab-general'}>
            <GeneralForm
              isNewSurvey={props.isNewSurvey}
              survey={surveyDefinition}
              isSurveyDirty={isDirty}
              isEditMode={isEditMode}
              canAddNew={surveyDefinition.questions.length < 10}
              handleAddPress={handleNewQuestion}
              handleChange={handleGeneralChange}
              handleDeletePress={() => setDeleteSurveyConfirmationIsOpen(true)}
              handleEditPress={handleEditPress}
            />
          </TabPanel>

          {surveyDefinition.questions.map((question, idx) => (
            <TabPanel key={`survey-designer-tab-${idx}`} tabId={`survey-designer-tab-${idx}`}>
              <QuestionForm
                isNewSurvey={props.isNewSurvey}
                isSurveyDirty={isDirty}
                isEditMode={isEditMode}
                canAddNew={surveyDefinition.questions.length < 10}
                canDelete={true}
                question={question}
                index={idx}
                handleAddPress={handleNewQuestion}
                handleDeletePress={handleDeleteQuestionPress}
                handleChange={handleQuestionChange}
                handleEditPress={handleEditPress}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <ConfirmationModal
        isOpen={saveConfirmationIsOpen}
        isProcessingAction={isProcessing}
        modalHeader={'Save and Activate'}
        modalBody={<Text as={'p'}>Are you sure you wish to save the survey and make it active?</Text>}
        actionLabel={'Save'}
        actionIsDestructive={false}
        handleConfirmAction={handleSaveAction}
        handleCancelAction={() => setSaveConfirmationIsOpen(false)}
      />

      <ConfirmationModal
        isOpen={deleteSurveyConfirmationIsOpen}
        isProcessingAction={isProcessing}
        modalHeader={'Delete Survey'}
        modalBody={<Text as={'p'}>Are you sure you wish to delete the entire survey?</Text>}
        actionLabel={'Delete'}
        actionIsDestructive={true}
        handleConfirmAction={handleDeleteSurveyAction}
        handleCancelAction={() => setDeleteSurveyConfirmationIsOpen(false)}
      />

      <ConfirmationModal
        isOpen={deleteQuestionConfirmationIsOpen}
        isProcessingAction={isProcessing}
        modalHeader={'Delete Question'}
        modalBody={<Text as={'p'}>Are you sure you wish to delete this question?</Text>}
        actionLabel={'Delete'}
        actionIsDestructive={true}
        handleConfirmAction={() => handleDeleteQuestionAction(currentQuestion)}
        handleCancelAction={() => setDeleteQuestionConfirmationIsOpen(false)}
      />

      <ConfirmationModal
        isOpen={editConfirmationIsOpen}
        isProcessingAction={isProcessing}
        modalHeader={'Edit Survey'}
        modalBody={
          <>
            <Paragraph>
              Editing an existing survey can have unintended consequences to the survey results. Asking questions with
              different phrasing or order may make comparisons between previous responses and future responses invalid.
              Before proceeding consider creating a new survey instead of editing this survey.
            </Paragraph>
            <Paragraph>
              <strong>Are you sure you wish to edit this survey?</strong>
            </Paragraph>
          </>
        }
        actionLabel={'I understand'}
        actionIsDestructive={true}
        handleConfirmAction={handleEditAction}
        handleCancelAction={() => setEditConfirmationIsOpen(false)}
      />

      <Toaster {...toaster} />
    </Stack>
  );
};
export default SurveyDesigner;
