import { Box } from '@twilio-paste/core/box';
import { Breadcrumb, BreadcrumbItem } from '@twilio-paste/core/breadcrumb';
import { Stack } from '@twilio-paste/core/stack';
import { Separator } from '@twilio-paste/core/separator';
import { useToaster } from '@twilio-paste/core/toast';
import { useEffect, useState } from 'react';

import { SurveyItem } from '../../types/SurveyItem';
import { Phase } from '../../types/Phase';
import { RuleItem } from '../../types/RuleItem';
import SurveyDesigner from '../SurveyDesigner/SurveyDesigner';
import SurveyList from '../SurveyList/SurveyList';
import RuleEditor from '../RuleEditor/RuleEditor';
import SurveyService from '../../utils/SurveyService';
import RuleList from '../RuleList/RuleList';

const PostCallSurveyView = () => {
  const [phase, setPhase] = useState<Phase>(Phase.SurveyList);
  const [loading, setLoading] = useState<boolean>(false);
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyItem | undefined>();
  const [currentRule, setCurrentRule] = useState<RuleItem | undefined>();
  const [queueNames, setQueueNames] = useState<string[]>([]);
  const [isNewSurvey, setIsNewSurvey] = useState<boolean>(true);
  const toaster = useToaster();

  const refreshData = () => {
    setLoading(true);

    const surveyPromise = SurveyService.getSurveys().then((response) => setSurveys(response));
    const rulesPromise = SurveyService.getRules().then((response) => setRules(response));
    const queuesPromise = SurveyService.getQueueNames().then((response) => setQueueNames(response));

    Promise.all([surveyPromise, rulesPromise, queuesPromise]).finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentSurvey(undefined);
    setPhase(Phase.SurveyList);
    refreshData();
  };

  const handleOpenSurvey = (key: string) => {
    const s = surveys.find((s) => s.key === key);
    if (!s) throw new Error(`Could not find survey with key: ${key}`);
    setIsNewSurvey(false);
    setCurrentSurvey(s);
    setPhase(Phase.SurveyEditor);
  };

  const handleNewSurvey = () => {
    setCurrentSurvey(SurveyService.createNewSurveyItem());
    setIsNewSurvey(true);
    setPhase(Phase.SurveyEditor);
  };

  const handleOpenRule = (r: RuleItem) => {
    setCurrentRule(r);
    setPhase(Phase.RuleEditor);
  };

  const handleNewRule = () => {
    setCurrentRule(SurveyService.createNewRule());
    setPhase(Phase.RuleEditor);
  };

  const handleDeleteSurveyAction = (key: string) => {
    SurveyService.deleteSurvey(key)
      .then(() => {
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
      .finally(() => refreshData());
  };

  const handleDeleteRuleAction = (key: string) => {
    SurveyService.deleteRule(key)
      .then(() => {
        toaster.push({
          message: 'Rule deleted successfully',
          variant: 'success',
          dismissAfter: 5000,
        });
      })
      .catch((err: any) => {
        console.warn(err);
        toaster.push({
          message: 'Error deleting rule, please check logs and check logs',
          variant: 'error',
          dismissAfter: 5000,
        });
      })
      .finally(() => refreshData());
  };

  const getPhase = () => {
    switch (phase) {
      case Phase.RuleEditor:
        return (
          <RuleEditor rule={currentRule || SurveyService.createNewRule()} surveys={surveys} queueNames={queueNames} />
        );
      case Phase.SurveyEditor:
        return (
          <SurveyDesigner
            isNewSurvey={isNewSurvey}
            survey={currentSurvey || SurveyService.createNewSurveyItem()}
            handleHomePress={() => setPhase(Phase.SurveyList)}
          />
        );
      default:
        return (
          <>
            <SurveyList
              isLoading={loading}
              handleOpenSurvey={handleOpenSurvey}
              handleNewSurvey={handleNewSurvey}
              handleRefresh={() => refreshData()}
              surveys={surveys}
              handleDeleteSurvey={handleDeleteSurveyAction}
            />
            <Separator verticalSpacing={'space120'} orientation={'horizontal'} />
            <RuleList
              isLoading={loading}
              rules={rules}
              handleOpenRule={handleOpenRule}
              handleNewRule={handleNewRule}
              handleRefresh={() => refreshData()}
              handleOpenSurvey={handleOpenSurvey}
              handleDeleteRule={handleDeleteRuleAction}
              surveys={surveys}
            />
          </>
        );
    }
  };

  return (
    <Box width={'100%'} overflowY={'scroll'}>
      <Box marginBottom="space60" marginTop={['space10', 'space60']} marginLeft="space60" marginRight="space60">
        <Stack orientation={'vertical'} spacing={'space40'}>
          <Breadcrumb>
            <BreadcrumbItem href="#" onClick={handleHomeClick}>
              Post Call Survey
            </BreadcrumbItem>
            <BreadcrumbItem>{phase}</BreadcrumbItem>
          </Breadcrumb>
          {getPhase()}
        </Stack>
      </Box>
    </Box>
  );
};
export default PostCallSurveyView;
