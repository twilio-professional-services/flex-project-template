import React, { useEffect, useState } from 'react';
import { ColumnDefinition, DataTable, Manager, templates } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { RRule } from 'rrule';

import RuleEditor from '../RuleEditor/RuleEditor';
import { Rule, Schedule } from '../../types/schedule-manager';
import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';
import RRuleLanguage from '../../utils/RRuleLanguage';

interface OwnProps {
  isLoading: boolean;
  rules: Rule[];
  schedules: Schedule[];
  updateRules: (rules: Rule[]) => void;
}

const RuleDataTable = (props: OwnProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null as Rule | null);
  const [openIndexNext, setOpenIndexNext] = useState(null as number | null);

  const ScheduleManagerStrings = Manager.getInstance().strings as any;

  useEffect(() => {
    if (openIndexNext) {
      setSelectedRule(props.rules[openIndexNext]);
      setOpenIndexNext(null);
    }
  }, [props.rules]);

  useEffect(() => {
    if (selectedRule !== null) {
      setShowPanel(true);
    }
  }, [selectedRule]);

  const createRuleClick = () => {
    setSelectedRule(null);
    setShowPanel(true);
  };

  const onPanelClosed = () => {
    setShowPanel(false);
    setSelectedRule(null);
  };

  const onRowClick = (item: Rule) => {
    setSelectedRule(item);
  };

  const onUpdateRule = (newRules: Rule[], openIndex: number | null) => {
    if (openIndex) {
      setOpenIndexNext(openIndex);
    }

    props.updateRules(newRules);
    document.querySelector('#rule-data-table-root')?.scrollIntoView({ behavior: 'smooth' });

    if (!openIndex) {
      setShowPanel(false);
      setSelectedRule(null);
    }
  };

  const getRuleType = (rule: Rule): string => {
    let typeStr = ScheduleManagerStrings[StringTemplates.OPEN];

    if (rule.isOpen === false) {
      typeStr = ScheduleManagerStrings[StringTemplates.CLOSED];

      if (rule.closedReason && rule.closedReason !== 'closed') {
        typeStr += ` (${rule.closedReason})`;
      }
    }

    return typeStr;
  };

  const getRuleTime = (rule: Rule): string => {
    let timeStr = ScheduleManagerStrings[StringTemplates.ANY_TIME];

    if (rule.startTime) {
      timeStr = rule.startTime;
    }

    if (rule.endTime) {
      timeStr += ` - ${rule.endTime}`;
    }

    return timeStr;
  };

  const getRuleDate = (rule: Rule): string => {
    let dateStr = ScheduleManagerStrings[StringTemplates.ANY_DAY];

    if (rule.startDate && rule.endDate && rule.startDate === rule.endDate) {
      dateStr = `${rule.startDate}`;
    } else {
      dateStr = '';

      if (rule.dateRRule) {
        dateStr += RRule.fromString(rule.dateRRule).toText(undefined, RRuleLanguage);
      }

      if (dateStr && (rule.startDate || rule.endDate)) {
        dateStr += ', ';
      }

      if (rule.startDate) {
        dateStr += templates[StringTemplates.DATE_FROM]({ startDate: rule.startDate });
      }

      if (rule.endDate) {
        if (dateStr) {
          dateStr += ' ';
        }
        dateStr += templates[StringTemplates.DATE_UNTIL]({ endDate: rule.endDate });
      }
    }

    return dateStr;
  };

  return (
    <>
      <div id="rule-data-table-root">
        <Box padding="space60">
          <Button variant="primary" disabled={props.isLoading} onClick={createRuleClick}>
            <PlusIcon decorative />
            {ScheduleManagerStrings[StringTemplates.CREATE_RULE_BUTTON]}
          </Button>
        </Box>
        <DataTable
          items={props.rules}
          isLoading={props.isLoading}
          onRowClick={onRowClick}
          defaultSortColumn="name-column"
        >
          <ColumnDefinition
            key="name-column"
            header={ScheduleManagerStrings[StringTemplates.NAME]}
            sortDirection="asc"
            sortingFn={(a: Rule, b: Rule) => (a.name > b.name ? 1 : -1)}
            content={(item: Rule) => <span>{item.name}</span>}
          />
          <ColumnDefinition
            key="type-column"
            header={ScheduleManagerStrings[StringTemplates.TYPE]}
            sortingFn={(a: Rule, b: Rule) => (getRuleType(a) > getRuleType(b) ? 1 : -1)}
            content={(item: Rule) => <span>{getRuleType(item)}</span>}
          />
          <ColumnDefinition
            key="time-column"
            header={ScheduleManagerStrings[StringTemplates.TIME]}
            sortingFn={(a: Rule, b: Rule) => (getRuleTime(a) > getRuleTime(b) ? 1 : -1)}
            content={(item: Rule) => <span>{getRuleTime(item)}</span>}
          />
          <ColumnDefinition
            key="date-column"
            header={ScheduleManagerStrings[StringTemplates.DATE]}
            sortingFn={(a: Rule, b: Rule) => (getRuleDate(a) > getRuleDate(b) ? 1 : -1)}
            content={(item: Rule) => <span>{getRuleDate(item)}</span>}
          />
        </DataTable>
      </div>
      <RuleEditor
        onPanelClosed={onPanelClosed}
        showPanel={showPanel}
        schedules={props.schedules}
        selectedRule={selectedRule}
        onUpdateRule={onUpdateRule}
      />
    </>
  );
};

export default RuleDataTable;
