import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { Anchor } from '@twilio-paste/core/anchor';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Text } from '@twilio-paste/core/text';
import { Stack } from '@twilio-paste/core/stack';
import { Spinner } from '@twilio-paste/core/spinner';
import { MenuButton, MenuItem, Menu, MenuSeparator, useMenuState } from '@twilio-paste/core/menu';
import { TBody, THead, Table, Td, Th, Tr } from '@twilio-paste/core/table';
import { FC } from 'react';

import { SurveyItem } from '../../types/SurveyItem';
import SurveyListEmpty from './SurveyListEmpty';

export interface SurveyListProps {
  isLoading: boolean;
  surveys: SurveyItem[];
  handleOpenSurvey: (key: string) => void;
  handleNewSurvey: () => void;
  handleRefresh: () => void;
  handleDeleteSurvey: (key: string) => void;
}

const LoadingRow = () => {
  return (
    <Tr>
      <Td scope="row">
        <SkeletonLoader />
      </Td>
      <Td>
        <SkeletonLoader />
      </Td>
      <Td>
        <SkeletonLoader />
      </Td>
      <Td>
        <SkeletonLoader />
      </Td>
      <Td>
        <SkeletonLoader />
      </Td>
      <Td textAlign="center">
        <SkeletonLoader />
      </Td>
    </Tr>
  );
};

export interface ActionMenuProps {
  survey_key: string;
}

const SurveyList: FC<SurveyListProps> = (props) => {
  const ActionMenu: React.FC<ActionMenuProps> = (menuProps) => {
    const menu = useMenuState();
    return (
      <Box display="flex" justifyContent="center">
        <MenuButton {...menu} variant="reset" size="reset">
          <MoreIcon decorative={false} title="More options" />
        </MenuButton>
        <Menu {...menu} aria-label="Preferences">
          <MenuItem {...menu} onClick={() => props.handleOpenSurvey(menuProps.survey_key)}>
            Edit Survey
          </MenuItem>
          <MenuSeparator {...menu} />
          <MenuItem variant="destructive" {...menu} onClick={() => props.handleDeleteSurvey(menuProps.survey_key)}>
            Delete Survey
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const SurveyTable = () => {
    return (
      <Table striped>
        <THead stickyHeader top={0}>
          <Tr>
            <Th width="size30">Survey Name</Th>
            <Th width="size40">Unique ID</Th>
            <Th>Updated By</Th>
            <Th>Last Update</Th>
            <Th>Questions</Th>
            <Th width="size10" textAlign="right">
              Actions
            </Th>
          </Tr>
        </THead>
        <TBody>
          {props.isLoading && (
            <>
              <LoadingRow />
              <LoadingRow />
              <LoadingRow />
            </>
          )}

          {!props.isLoading &&
            props.surveys.map((survey, idx) => (
              <Tr key={`survey-row-${idx}`}>
                <Td>
                  <Anchor
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleOpenSurvey(survey.key);
                    }}
                  >
                    {survey.data.name}
                  </Anchor>
                </Td>
                <Td>
                  <Text fontFamily="fontFamilyCode" as={'span'}>
                    {survey.key}
                  </Text>
                </Td>
                <Td>{survey.descriptor?.created_by || ''}</Td>
                <Td>
                  <Text as={'span'}>{new Date(survey.descriptor?.date_updated).toISOString() || ''}</Text>
                </Td>
                <Td>{survey.data.questions.length}</Td>
                <Td textAlign="right">
                  <ActionMenu survey_key={survey.key} />
                </Td>
              </Tr>
            ))}
        </TBody>
      </Table>
    );
  };

  return (
    <Stack orientation="vertical" spacing="space70">
      <Box alignItems="center" display="flex">
        <Heading as="h2" variant="heading20" marginBottom="space0">
          <span aria-label="survey image" role="img">
            📞
          </span>{' '}
          Survey List
        </Heading>
        <Box marginLeft="auto">
          <ButtonGroup>
            <Button variant="secondary" onClick={props.handleRefresh} disabled={props.isLoading}>
              {props.isLoading && <Spinner decorative={true} />}
              Refresh
            </Button>
            <Button variant="primary" onClick={props.handleNewSurvey} disabled={props.isLoading}>
              ✨ Add new survey
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Paragraph>
        Customer feedback is super important ! These surveys will be played to customers at the end of the call once the
        agent presses the hang up button. Keep the questions to as few as possible and think hard about the words you
        use to request feedback. combinations. Go ahead, add your own.
      </Paragraph>
      {props.surveys.length === 0 && (
        <SurveyListEmpty handleNewSurvey={props.handleNewSurvey} canAddNew={!props.isLoading} />
      )}
      {props.surveys.length > 0 && <SurveyTable />}
    </Stack>
  );
};
export default SurveyList;
