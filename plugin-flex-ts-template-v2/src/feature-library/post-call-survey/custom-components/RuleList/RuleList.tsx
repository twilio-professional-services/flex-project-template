import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Stack } from '@twilio-paste/core/stack';
import { Anchor } from '@twilio-paste/core/anchor';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Text } from '@twilio-paste/core/text';
import { Badge } from '@twilio-paste/core/badge';
import { Spinner } from '@twilio-paste/core/spinner';
import { MenuButton, MenuItem, Menu, MenuSeparator, useMenuState } from '@twilio-paste/core/menu';
import { TBody, THead, Table, Td, Th, Tr } from '@twilio-paste/core/table';
import { FC } from 'react';

import { RuleItem } from '../../types/RuleItem';
import { SurveyItem } from '../../types/SurveyItem';
import RuleListEmpty from './RuleListEmpty';

export interface RuleListProps {
  isLoading: boolean;
  rules: RuleItem[];
  surveys: SurveyItem[];
  handleOpenRule: (rule: RuleItem) => void;
  handleNewRule: () => void;
  handleRefresh: () => void;
  handleOpenSurvey: (key: string) => void;
  handleDeleteRule: (key: string) => void;
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
      <Td textAlign="right">
        <SkeletonLoader />
      </Td>
    </Tr>
  );
};

export interface ActionMenuProps {
  rule: RuleItem;
}

const RuleList: FC<RuleListProps> = (props) => {
  const ActionMenu: React.FC<ActionMenuProps> = (menuProps) => {
    const menu = useMenuState();
    return (
      <Box display="flex" justifyContent="center">
        <MenuButton {...menu} variant="reset" size="reset">
          <MoreIcon decorative={false} title="More options" />
        </MenuButton>
        <Menu {...menu} aria-label="Preferences">
          <MenuItem {...menu} onClick={() => props.handleOpenRule(menuProps.rule)}>
            Edit Rule
          </MenuItem>
          <MenuSeparator {...menu} />
          <MenuItem variant="destructive" {...menu} onClick={() => props.handleDeleteRule(menuProps.rule.key)}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const RuleTable = () => {
    return (
      <Table striped>
        <THead stickyHeader top={0}>
          <Tr>
            <Th width="size30">Queue Name</Th>
            <Th>Unique ID</Th>
            <Th width="size40">Survey Name</Th>
            <Th>Survey ID</Th>
            <Th>Status</Th>
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
            props.rules.map((rule, idx) => (
              <Tr key={`rule-row-${idx}`}>
                <Td>
                  <Anchor
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleOpenRule(rule);
                    }}
                  >
                    {rule.data.queue_name}
                  </Anchor>
                </Td>
                <Td>
                  <Text fontFamily="fontFamilyCode" as={'span'}>
                    {rule.key}
                  </Text>
                </Td>
                <Td>
                  <Anchor
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleOpenSurvey(rule.data.survey_key);
                    }}
                  >
                    {props.surveys.find((s) => s.key === rule.data.survey_key)?.data.name || ''}
                  </Anchor>
                </Td>
                <Td>
                  <Text fontFamily="fontFamilyCode" as={'span'}>
                    {rule.data.survey_key}
                  </Text>
                </Td>
                <Td>
                  <Badge variant={rule.data.active ? 'success' : 'neutral'} as={'span'}>
                    {rule.data.active ? 'Active' : 'Disabled'}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <ActionMenu rule={rule} />
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
            🎯
          </span>{' '}
          Activation Rules
        </Heading>
        <Box marginLeft="auto">
          <ButtonGroup>
            <Button variant="secondary" onClick={props.handleRefresh} disabled={props.isLoading}>
              {props.isLoading && <Spinner decorative={true} />}
              Refresh
            </Button>
            <Button
              variant="primary"
              onClick={props.handleNewRule}
              disabled={props.isLoading || props.surveys.length === 0}
            >
              ✨ Add new rule
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Paragraph>
        Below are the rules that are used to determine which survey will be offered to a given caller.
      </Paragraph>
      {props.rules.length === 0 && (
        <RuleListEmpty handleNewRule={props.handleNewRule} canAddNew={props.surveys.length > 0 && !props.isLoading} />
      )}
      {props.rules.length > 0 && <RuleTable />}
    </Stack>
  );
};
export default RuleList;
