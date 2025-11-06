import React, { useEffect, useState } from 'react';
import { ColumnDefinition, DataTable, Manager, templates } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';

import ScheduleEditor from '../ScheduleEditor/ScheduleEditor';
import { Rule, Schedule } from '../../types/schedule-manager';
import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

interface OwnProps {
  isLoading: boolean;
  rules: Rule[];
  schedules: Schedule[];
  updateSchedules: (schedules: Schedule[]) => void;
  updated: Date;
}

const ScheduleDataTable = (props: OwnProps) => {
  const maxRulesLength = 80;

  const [showPanel, setShowPanel] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null as Schedule | null);
  const [statusTimestamp, setStatusTimestamp] = useState('');
  const [openIndexNext, setOpenIndexNext] = useState(null as number | null);

  const ScheduleManagerStrings = Manager.getInstance().strings as any;

  useEffect(() => {
    setStatusTimestamp(`${props.updated.toLocaleTimeString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`);
  }, [props.updated]);

  useEffect(() => {
    if (openIndexNext) {
      setSelectedSchedule(props.schedules[openIndexNext]);
      setOpenIndexNext(null);
    }
  }, [props.schedules]);

  useEffect(() => {
    if (selectedSchedule !== null) {
      setShowPanel(true);
    }
  }, [selectedSchedule]);

  const createScheduleClick = () => {
    setSelectedSchedule(null);
    setShowPanel(true);
  };

  const onPanelClosed = () => {
    setShowPanel(false);
    setSelectedSchedule(null);
  };

  const onRowClick = (item: Schedule) => {
    setSelectedSchedule(item);
  };

  const onUpdateSchedule = (newSchedules: Schedule[], openIndex: number | null) => {
    if (openIndex) {
      setOpenIndexNext(openIndex);
    }

    props.updateSchedules(newSchedules);
    document.querySelector('#schedule-data-table-root')?.scrollIntoView({ behavior: 'smooth' });

    if (!openIndex) {
      setShowPanel(false);
      setSelectedSchedule(null);
    }
  };

  const getScheduleStatus = (schedule: Schedule): string => {
    if (!schedule.status) {
      return ScheduleManagerStrings[StringTemplates.STATUS_PENDING];
    }

    const { isOpen, closedReason } = schedule.status;

    if (isOpen) {
      return ScheduleManagerStrings[StringTemplates.OPEN];
    }

    if (closedReason.toLowerCase() === 'closed') {
      return ScheduleManagerStrings[StringTemplates.CLOSED];
    }
    return `${ScheduleManagerStrings[StringTemplates.CLOSED]} (${closedReason})`;
  };

  const getScheduleRules = (schedule: Schedule): string => {
    const ruleNames = [] as string[];

    schedule.rules.forEach((ruleGuid) => {
      const matchingRule = props.rules.find((rule) => rule.id === ruleGuid);

      if (matchingRule) {
        ruleNames.push(matchingRule.name);
      }
    });

    return ruleNames.join(', ');
  };

  return (
    <>
      <div id="schedule-data-table-root">
        <Box padding="space60">
          <Button variant="primary" disabled={props.isLoading} onClick={createScheduleClick}>
            <PlusIcon decorative />
            {ScheduleManagerStrings[StringTemplates.CREATE_SCHEDULE_BUTTON]}
          </Button>
        </Box>
        <DataTable
          items={props.schedules}
          isLoading={props.isLoading}
          onRowClick={onRowClick}
          defaultSortColumn="name-column"
        >
          <ColumnDefinition
            key="name-column"
            header={ScheduleManagerStrings[StringTemplates.NAME]}
            sortDirection="asc"
            sortingFn={(a: Schedule, b: Schedule) => (a.name > b.name ? 1 : -1)}
            content={(item: Schedule) => <span>{item.name}</span>}
          />
          <ColumnDefinition
            key="status-column"
            header={ScheduleManagerStrings[StringTemplates.COLUMN_STATUS]}
            subHeader={props.isLoading ? '' : templates[StringTemplates.COLUMN_STATUS_ASOF]({ statusTimestamp })}
            sortingFn={(a: Schedule, b: Schedule) => (getScheduleStatus(a) > getScheduleStatus(b) ? 1 : -1)}
            content={(item: Schedule) => <span>{getScheduleStatus(item)}</span>}
          />
          <ColumnDefinition
            key="rules-column"
            header={ScheduleManagerStrings[StringTemplates.RULES]}
            sortingFn={(a: Schedule, b: Schedule) => (getScheduleRules(a) > getScheduleRules(b) ? 1 : -1)}
            content={(item: Schedule) => {
              const ruleStr = getScheduleRules(item);
              let trimmed = ruleStr;

              if (trimmed.length > maxRulesLength) {
                trimmed = `${trimmed.slice(0, maxRulesLength)}...`;
              }

              return <span title={ruleStr}>{trimmed}</span>;
            }}
          />
          <ColumnDefinition
            key="timezone-column"
            header={ScheduleManagerStrings[StringTemplates.TIMEZONE]}
            sortingFn={(a: Schedule, b: Schedule) => (a.timeZone > b.timeZone ? 1 : -1)}
            content={(item: Schedule) => <span>{item.timeZone}</span>}
          />
          <ColumnDefinition
            key="manually-closed-column"
            header={ScheduleManagerStrings[StringTemplates.COLUMN_MANUALLYCLOSED]}
            sortingFn={(a: Schedule, _b: Schedule) => (a.manualClose ? 1 : -1)}
            content={(item: Schedule) => (
              <span>
                {item.manualClose === true
                  ? ScheduleManagerStrings[StringTemplates.CLOSED_YES]
                  : ScheduleManagerStrings[StringTemplates.CLOSED_NO]}
              </span>
            )}
          />
        </DataTable>
      </div>
      <ScheduleEditor
        onPanelClosed={onPanelClosed}
        rules={props.rules}
        showPanel={showPanel}
        selectedSchedule={selectedSchedule}
        onUpdateSchedule={onUpdateSchedule}
      />
    </>
  );
};

export default ScheduleDataTable;
