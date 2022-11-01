import React, { useEffect, useState } from 'react';
import tzdata from 'tzdata';
import { ColumnDefinition, DataTable, SidePanel } from '@twilio/flex-ui';
import { Alert } from '@twilio-paste/core/alert';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { Checkbox } from '@twilio-paste/core/checkbox';
import { Combobox, UseComboboxState, useCombobox } from '@twilio-paste/core/combobox';
import { Heading } from '@twilio-paste/core/heading';
import { HelpText } from '@twilio-paste/core/help-text';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { ChevronDownIcon } from "@twilio-paste/icons/esm/ChevronDownIcon";
import { ChevronUpIcon } from "@twilio-paste/icons/esm/ChevronUpIcon";
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";

import { isScheduleUnique, updateScheduleData } from '../../utils/schedule-manager';
import { Schedule, Rule } from '../../types/schedule-manager';
import ScheduleManagerStrings, { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

interface OwnProps {
  onPanelClosed: () => void;
  rules: Rule[];
  showPanel: boolean;
  selectedSchedule: Schedule | null;
  onUpdateSchedule: (schedules: Schedule[], openIndex: number | null) => void;
}

const ScheduleEditor = (props: OwnProps) => {
  const [filteredTimeZones, setFilteredTimeZones] = useState([] as string[]);
  const [timeZones, setTimeZones] = useState([] as string[]);
  
  const [name, setName] = useState("");
  const [manualClose, setManualClose] = useState(false);
  const [timeZone, setTimeZone] = useState("");
  const [rules, setRules] = useState([] as Rule[]);
  const [filteredRules, setFilteredRules] = useState([] as Rule[]);
  const [addRuleInput, setAddRuleInput] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    let zones = [];
    for (const [key, _value] of Object.entries(tzdata.zones)) {
      zones.push(key);
    }
    
    setTimeZones(zones.sort());
  }, []);
  
  useEffect(() => {
    resetView();
    
    if (!props.selectedSchedule) {
      return;
    }
    
    setName(props.selectedSchedule.name);
    setManualClose(props.selectedSchedule.manualClose);
    setTimeZone(props.selectedSchedule.timeZone);
    
    let rules = [] as Rule[];
    
    props.selectedSchedule.rules.forEach(ruleGuid => {
      const matchingRule = props.rules.find(rule => rule.id == ruleGuid);
      
      if (matchingRule) {
        rules.push(matchingRule);
      }
    });
    
    setRules(rules);
  }, [props.selectedSchedule]);
  
  useEffect(() => {
    if (!props.showPanel) {
      resetView();
    }
  }, [props.showPanel]);
  
  useEffect(() => {
    let filtered = props.rules.filter(rule => {
      // Rule not yet added and matches input text if present
      return rules.indexOf(rule) < 0 && (!addRuleInput || rule.name.toLowerCase().indexOf(addRuleInput.toLowerCase()) >= 0)
    });
    filtered.sort((a, b) => (a.name > b.name) ? 1 : -1);
    
    setFilteredRules(filtered);
  }, [props.rules, rules, addRuleInput]);
  
  useEffect(() => {
    setFilteredTimeZones(timeZones);
  }, [timeZones]);
  
  const resetView = () => {
    setName("");
    setManualClose(false);
    setTimeZone("");
    setRules([]);
    setAddRuleInput('');
    setError('');
  }
  
  const handleChangeName = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }
  
  const handleChangeTimeZone = (changes: Partial<UseComboboxState<string>>) => {
    if (changes.selectedItem) {
      setTimeZone(changes.selectedItem);
    }
  }
  
  const handleChangeManualClose = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualClose(event.target.checked);
  }
  
  const handleAddRule = (changes: Partial<UseComboboxState<Rule>>) => {
    if (changes.selectedItem) {
      setRules([ ...rules, changes.selectedItem ]);
      reset();
    }
  }
  
  const {reset, ...state} = useCombobox({
    items: filteredRules,
    inputValue: addRuleInput,
    onInputValueChange: ({inputValue}) => setAddRuleInput(inputValue ?? ''),
    onSelectedItemChange: handleAddRule,
    itemToString: () => ''
  });
  
  const handleRuleUp = (rule: Rule) => {
    const newRules = [...rules];
    
    var fromIndex = newRules.indexOf(rule);
    
    if (fromIndex > 0) {
      newRules.splice(fromIndex, 1);
      newRules.splice(fromIndex - 1, 0, rule);
    }
    
    setRules(newRules);
  }
  
  const handleRuleDown = (rule: Rule) => {
    const newRules = [...rules];
    
    var fromIndex = newRules.indexOf(rule);
    
    if (fromIndex < newRules.length) {
      newRules.splice(fromIndex, 1);
      newRules.splice(fromIndex + 1, 0, rule);
    }
    
    setRules(newRules);
  }
  
  const handleRuleRemove = (rule: Rule) => {
    setRules(rules => rules.filter(item => rule.id !== item.id));
  }
  
  const saveSchedule = (copy: boolean = false) => {
    if (!name) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_NAME_REQUIRED]);
      return;
    }
    
    if (!timeZone) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_TIMEZONE_REQUIRED]);
      return;
    }
    
    const newSchedule = { name, manualClose, timeZone, rules: rules.map(rule => rule.id) };
    
    if (isScheduleUnique(newSchedule, props.selectedSchedule)) {
      setError('');
      const newScheduleData = updateScheduleData(newSchedule, props.selectedSchedule);
      
      if (copy) {
        copySchedule(newSchedule);
      } else {
        props.onUpdateSchedule(newScheduleData, null);
      }
    } else {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_NAME_UNIQUE]);
    }
  }
  
  const copySchedule = (schedule: Schedule) => {
    let name = schedule.name + ` ${ScheduleManagerStrings[StringTemplates.NAME_COPY]}`;
    
    let scheduleCopy = {
      ...schedule,
      name
    }
    
    while (!isScheduleUnique(scheduleCopy, null)) {
      scheduleCopy.name = scheduleCopy.name + ` ${ScheduleManagerStrings[StringTemplates.NAME_COPY]}`;
    }
    
    const scheduleCopyData = updateScheduleData(scheduleCopy, null);
    props.onUpdateSchedule(scheduleCopyData, scheduleCopyData.indexOf(scheduleCopy));
  }
  
  const handleSave = () => {
    saveSchedule(false);
  }
  
  const handleCopy = () => {
    saveSchedule(true);
  }
  
  const handleDelete = () => {
    if (!props.selectedSchedule) {
      return;
    }
    
    const newScheduleData = updateScheduleData(null, props.selectedSchedule);
    props.onUpdateSchedule(newScheduleData, null);
  }
  
  return (
    <SidePanel
      displayName='scheduleEditor'
      isHidden={!props.showPanel}
      handleCloseClick={props.onPanelClosed}
      title={<span>{ props.selectedSchedule === null ? ScheduleManagerStrings[StringTemplates.NEW_SCHEDULE_TITLE] : ScheduleManagerStrings[StringTemplates.EDIT_SCHEDULE_TITLE] }</span>}
    >
      <Box padding='space60'>
        <Stack orientation="vertical" spacing='space80'>
          <>
            <Label htmlFor="name" required>{ScheduleManagerStrings[StringTemplates.NAME]}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={handleChangeName}
              required />
          </>
          <Combobox
            autocomplete
            items={filteredTimeZones}
            labelText={ScheduleManagerStrings[StringTemplates.TIMEZONE]}
            selectedItem={timeZone}
            onSelectedItemChange={handleChangeTimeZone}
            onInputValueChange={({ inputValue }) => {
              if (inputValue) {
                setFilteredTimeZones(timeZones.filter(timeZone => timeZone.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0))
              } else {
                setFilteredTimeZones(timeZones);
              }
            }}
            required />
          <Checkbox
            checked={manualClose}
            onChange={handleChangeManualClose}
            id="manualClose"
            name="manualClose"
            helpText={ScheduleManagerStrings[StringTemplates.MANUALLYCLOSE_TEXT]}>
            {ScheduleManagerStrings[StringTemplates.MANUALLYCLOSE]}
          </Checkbox>
          <Heading as="h3" variant="heading30">
            {ScheduleManagerStrings[StringTemplates.RULES]}
          </Heading>
          <HelpText>{ScheduleManagerStrings[StringTemplates.RULES_TEXT]}</HelpText>
          <Combobox
            autocomplete
            items={filteredRules}
            labelText={ScheduleManagerStrings[StringTemplates.ADD_RULE]}
            optionTemplate={(item: Rule) => item.name}
            state={{...state}} />
          <DataTable
            items={rules}>
            <ColumnDefinition
              key="actions-column"
              header={ScheduleManagerStrings[StringTemplates.COLUMN_ACTIONS]}
              content={(item: Rule) => (
                  <Stack orientation='horizontal' spacing='space20'>
                    <Button variant='secondary' size='icon_small' onClick={_ => handleRuleUp(item)}>
                      <ChevronUpIcon decorative={false} title={ScheduleManagerStrings[StringTemplates.UP]} />
                    </Button>
                    <Button variant='secondary' size='icon_small' onClick={_ => handleRuleDown(item)}>
                      <ChevronDownIcon decorative={false} title={ScheduleManagerStrings[StringTemplates.DOWN]} />
                    </Button>
                    <Button variant='destructive_secondary' size='icon_small' onClick={_ => handleRuleRemove(item)}>
                      <DeleteIcon decorative={false} title={ScheduleManagerStrings[StringTemplates.REMOVE_FROM_SCHEDULE]} />
                    </Button>
                  </Stack>
                )} />
            <ColumnDefinition
              key="name-column"
              header={ScheduleManagerStrings[StringTemplates.COLUMN_RULE]}
              content={(item: Rule) => {
                return <span>{item.name}</span>
              }} />
          </DataTable>
          {
            error.length > 0 &&
            (
              <Alert variant='error'>{error}</Alert>
            )
          }
          <Stack orientation='horizontal' spacing='space30'>
            <Button variant='primary' onClick={handleSave}>
              {ScheduleManagerStrings[StringTemplates.SAVE_BUTTON]}
            </Button>
            <Button variant='secondary' onClick={handleCopy}>
              {ScheduleManagerStrings[StringTemplates.SAVE_COPY_BUTTON]}
            </Button>
            {
              props.selectedSchedule !== null && (
                <Button variant='destructive_secondary' onClick={handleDelete}>
                  {ScheduleManagerStrings[StringTemplates.DELETE_BUTTON]}
                </Button>
              )
            }
          </Stack>
        </Stack>
      </Box>
    </SidePanel>
  );
}

export default ScheduleEditor;