import React, { useEffect, useState } from 'react';
import { Manager, SidePanel, templates } from '@twilio/flex-ui';
import { Alert } from '@twilio-paste/core/alert';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { Checkbox, CheckboxGroup } from '@twilio-paste/core/checkbox';
import { DatePicker } from '@twilio-paste/core/date-picker';
import { Heading } from '@twilio-paste/core/heading';
import { HelpText } from '@twilio-paste/core/help-text';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Select, Option } from '@twilio-paste/core/select';
import { Stack } from '@twilio-paste/core/stack';
import { TimePicker } from '@twilio-paste/core/time-picker';
import { RRule, Frequency, ByWeekday } from 'rrule';
import { v4 as uuidv4 } from 'uuid';

import { isRuleUnique, updateRuleData } from '../../utils/schedule-manager';
import { Rule, Schedule } from '../../types/schedule-manager';
import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

interface OwnProps {
  onPanelClosed: () => void;
  showPanel: boolean;
  schedules: Schedule[];
  selectedRule: Rule | null;
  onUpdateRule: (rules: Rule[], openIndex: number | null) => void;
}

const RuleEditor = (props: OwnProps) => {
  // general
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [closedReason, setClosedReason] = useState('closed');

  // time settings
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // date settings
  const [recurrence, setRecurrence] = useState('none');

  // daily recurrence
  const [singleDate, setSingleDate] = useState('');

  // weekly recurrence
  const [dowMonday, setDowMonday] = useState(false);
  const [dowTuesday, setDowTuesday] = useState(false);
  const [dowWednesday, setDowWednesday] = useState(false);
  const [dowThursday, setDowThursday] = useState(false);
  const [dowFriday, setDowFriday] = useState(false);
  const [dowSaturday, setDowSaturday] = useState(false);
  const [dowSunday, setDowSunday] = useState(false);

  // monthly or yearly recurrence
  const [dayOfMonth, setDayOfMonth] = useState('');

  // yearly recurrence
  const [month, setMonth] = useState('1');

  // restrict dates
  const [restrictDates, setRestrictDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const ScheduleManagerStrings = Manager.getInstance().strings as any;

  const resetView = () => {
    setError('');
    setName('');
    setIsOpen(true);
    setClosedReason('closed');
    setAllDay(true);
    setStartTime('');
    setEndTime('');
    setRecurrence('none');
    setSingleDate('');
    setDowMonday(false);
    setDowTuesday(false);
    setDowWednesday(false);
    setDowThursday(false);
    setDowFriday(false);
    setDowSaturday(false);
    setDowSunday(false);
    setDayOfMonth('');
    setMonth('1');
    setRestrictDates(false);
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    resetView();

    if (props.selectedRule === null) {
      return;
    }

    const rule = props.selectedRule;

    setName(rule.name);
    setIsOpen(rule.isOpen);
    setClosedReason(rule.closedReason);
    setAllDay(!rule.startTime && !rule.endTime);
    setStartTime(rule.startTime);
    setEndTime(rule.endTime);

    if (rule.dateRRule) {
      const ruleOptions = RRule.parseString(rule.dateRRule);

      switch (ruleOptions.freq) {
        case Frequency.DAILY:
          setRecurrence('daily');
          break;
        case Frequency.WEEKLY:
          setRecurrence('weekly');
          if (ruleOptions.byweekday) {
            const isArray = Array.isArray(ruleOptions.byweekday);
            setDowMonday(
              ruleOptions.byweekday === RRule.MO ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.MO) >= 0),
            );
            setDowTuesday(
              ruleOptions.byweekday === RRule.TU ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.TU) >= 0),
            );
            setDowWednesday(
              ruleOptions.byweekday === RRule.WE ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.WE) >= 0),
            );
            setDowThursday(
              ruleOptions.byweekday === RRule.TH ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.TH) >= 0),
            );
            setDowFriday(
              ruleOptions.byweekday === RRule.FR ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.FR) >= 0),
            );
            setDowSaturday(
              ruleOptions.byweekday === RRule.SA ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.SA) >= 0),
            );
            setDowSunday(
              ruleOptions.byweekday === RRule.SU ||
                (isArray && (ruleOptions.byweekday as ByWeekday[]).indexOf(RRule.SU) >= 0),
            );
          }
          break;
        case Frequency.MONTHLY:
          setRecurrence('monthly');
          if (!Array.isArray(ruleOptions.bymonthday)) {
            setDayOfMonth(ruleOptions.bymonthday ? ruleOptions.bymonthday.toString() : '');
          }
          break;
        case Frequency.YEARLY:
          setRecurrence('yearly');
          if (!Array.isArray(ruleOptions.bymonthday)) {
            setDayOfMonth(ruleOptions.bymonthday ? ruleOptions.bymonthday.toString() : '');
          }
          if (!Array.isArray(ruleOptions.bymonth)) {
            setMonth(ruleOptions.bymonth ? ruleOptions.bymonth.toString() : '');
          }
          break;
        default:
          setRecurrence('none');
          break;
      }
    } else {
      setRecurrence('none');
      setSingleDate(rule.startDate);
    }

    if (rule.dateRRule && (rule.startDate || rule.endDate)) {
      setRestrictDates(true);
    } else {
      setRestrictDates(false);
    }

    setStartDate(rule.startDate);
    setEndDate(rule.endDate);
  }, [props.selectedRule]);

  useEffect(() => {
    if (!props.showPanel) {
      resetView();
    }
  }, [props.showPanel]);

  const handleChangeName = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleIsOpenChange = (value: string) => {
    if (value === 'open') {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleChangeClosedReason = (event: React.FormEvent<HTMLInputElement>) => {
    setClosedReason(event.currentTarget.value);
  };

  const handleChangeAllDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllDay(event.target.checked);
  };

  const handleChangeStartTime = (event: React.FormEvent<HTMLInputElement>) => {
    setStartTime(event.currentTarget.value);
  };

  const handleChangeEndTime = (event: React.FormEvent<HTMLInputElement>) => {
    setEndTime(event.currentTarget.value);
  };

  const handleChangeRecurrence = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecurrence(event.target.value);
  };

  const handleChangeSingleDate = (event: React.FormEvent<HTMLInputElement>) => {
    setSingleDate(event.currentTarget.value);
  };

  const handleChangeDow = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'dowMonday':
        setDowMonday(event.target.checked);
        break;
      case 'dowTuesday':
        setDowTuesday(event.target.checked);
        break;
      case 'dowWednesday':
        setDowWednesday(event.target.checked);
        break;
      case 'dowThursday':
        setDowThursday(event.target.checked);
        break;
      case 'dowFriday':
        setDowFriday(event.target.checked);
        break;
      case 'dowSaturday':
        setDowSaturday(event.target.checked);
        break;
      case 'dowSunday':
        setDowSunday(event.target.checked);
        break;
      default:
        break;
    }
  };

  const handleChangeDayOfMonth = (event: React.FormEvent<HTMLInputElement>) => {
    // the Paste 'number' input type doesn't handle non-numbers well
    // the change handler won't even run if we use the number type and enter a letter

    const inputStr = event.currentTarget.value;
    const day = parseInt(inputStr, 10);

    if (day.toString() !== inputStr || day < 1 || day > 31) {
      setDayOfMonth('');
      return;
    }

    setDayOfMonth(event.currentTarget.value);
  };

  const handleChangeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(event.target.value);
  };

  const handleChangeRestrictDates = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestrictDates(event.target.checked);
  };

  const handleChangeStartDate = (event: React.FormEvent<HTMLInputElement>) => {
    setStartDate(event.currentTarget.value);
  };

  const handleChangeEndDate = (event: React.FormEvent<HTMLInputElement>) => {
    setEndDate(event.currentTarget.value);
  };

  const copyRule = (rule: Rule) => {
    const name = `${rule.name} ${ScheduleManagerStrings[StringTemplates.NAME_COPY]}`;

    const ruleCopy = {
      ...rule,
      id: uuidv4(),
      name,
    };

    while (!isRuleUnique(ruleCopy, null)) {
      ruleCopy.name += ` ${ScheduleManagerStrings[StringTemplates.NAME_COPY]}`;
    }

    const ruleCopyData = updateRuleData(ruleCopy, null);
    props.onUpdateRule(ruleCopyData, ruleCopyData.indexOf(ruleCopy));
  };

  const saveRule = (copy: boolean) => {
    // validation
    if (!name) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_NAME_REQUIRED]);
      return;
    }

    if (!isOpen && !closedReason) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_REASON_REQUIRED]);
      return;
    }

    if (!allDay && (!startTime || !endTime)) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_TIME_REQUIRED]);
      return;
    }

    if (!allDay) {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);

      if (start >= end) {
        setError(ScheduleManagerStrings[StringTemplates.ERROR_ENDTIME]);
        return;
      }
    }

    switch (recurrence) {
      case 'none':
        if (!singleDate) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DATE_REQUIRED]);
          return;
        }
        break;
      case 'weekly':
        if (!dowMonday && !dowTuesday && !dowWednesday && !dowThursday && !dowFriday && !dowSaturday && !dowSunday) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOW_REQUIRED]);
          return;
        }
        break;
      case 'monthly':
        if (!dayOfMonth) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOM_REQUIRED]);
          return;
        }
        const numDayOfMonthMonthly = Number(dayOfMonth);
        if (isNaN(numDayOfMonthMonthly)) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOM_NUMBER]);
          return;
        }
        if (numDayOfMonthMonthly < 1 || numDayOfMonthMonthly > 31) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOM_RANGE]);
          return;
        }
        break;
      case 'yearly':
        const numDayOfMonthYearly = Number(dayOfMonth);
        if (isNaN(numDayOfMonthYearly)) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOM_NUMBER]);
          return;
        }
        if (numDayOfMonthYearly < 1 || numDayOfMonthYearly > 31) {
          setError(ScheduleManagerStrings[StringTemplates.ERROR_DOM_RANGE]);
          return;
        }
        break;
      default:
        break;
    }

    if (recurrence !== 'none' && restrictDates && !startDate && !endDate) {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_STARTENDDATE_REQUIRED]);
      return;
    }

    if (recurrence !== 'none' && restrictDates && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        setError(ScheduleManagerStrings[StringTemplates.ERROR_ENDDATE]);
        return;
      }
    }

    // build new rule

    let ruleId;

    if (props.selectedRule) {
      ruleId = props.selectedRule.id;
    } else {
      ruleId = uuidv4();
    }

    const newRule = {
      id: ruleId,
      name,
      isOpen,
    } as Rule;

    if (!isOpen) {
      newRule.closedReason = closedReason;
    }

    if (!allDay) {
      newRule.startTime = startTime;
      newRule.endTime = endTime;
    }

    switch (recurrence) {
      case 'none':
        newRule.startDate = singleDate;
        newRule.endDate = singleDate;
        break;
      case 'daily':
        const dailyRRule = new RRule({
          freq: Frequency.DAILY,
        });
        newRule.dateRRule = dailyRRule.toString();
        break;
      case 'weekly':
        const weekdays = [] as ByWeekday[];

        if (dowMonday) weekdays.push(RRule.MO);
        if (dowTuesday) weekdays.push(RRule.TU);
        if (dowWednesday) weekdays.push(RRule.WE);
        if (dowThursday) weekdays.push(RRule.TH);
        if (dowFriday) weekdays.push(RRule.FR);
        if (dowSaturday) weekdays.push(RRule.SA);
        if (dowSunday) weekdays.push(RRule.SU);

        const weeklyRRule = new RRule({
          freq: Frequency.WEEKLY,
          byweekday: weekdays,
        });
        newRule.dateRRule = weeklyRRule.toString();
        break;
      case 'monthly':
        const monthlyRRule = new RRule({
          freq: Frequency.MONTHLY,
          bymonthday: Number(dayOfMonth),
        });
        newRule.dateRRule = monthlyRRule.toString();
        break;
      case 'yearly':
        let monthNum = 1;
        if (month) {
          monthNum = Number(month);
        }
        const yearlyRRule = new RRule({
          freq: Frequency.YEARLY,
          bymonth: monthNum,
          bymonthday: Number(dayOfMonth),
        });
        newRule.dateRRule = yearlyRRule.toString();
        break;
      default:
        break;
    }

    if (recurrence !== 'none' && restrictDates) {
      newRule.startDate = startDate;
      newRule.endDate = endDate;
    }

    if (isRuleUnique(newRule, props.selectedRule)) {
      setError('');
      const newRuleData = updateRuleData(newRule, props.selectedRule);

      if (copy) {
        copyRule(newRule);
      } else {
        props.onUpdateRule(newRuleData, null);
      }
    } else {
      setError(ScheduleManagerStrings[StringTemplates.ERROR_NAME_UNIQUE]);
    }
  };

  const handleSave = () => {
    saveRule(false);
  };

  const handleCopy = () => {
    saveRule(true);
  };

  const handleDelete = () => {
    if (!props.selectedRule) {
      return;
    }

    // Check if rule is referenced. If so, fail!
    const refSchedules = [] as string[];
    if (props.schedules) {
      props.schedules.forEach((schedule) => {
        if (props.selectedRule && schedule.rules.indexOf(props.selectedRule.id) >= 0) {
          refSchedules.push(schedule.name);
        }
      });
    }

    if (refSchedules.length > 0) {
      setError(`${ScheduleManagerStrings[StringTemplates.ERROR_RULE_REFERENCED]} ${refSchedules.join(', ')}`);
      return;
    }

    const newRuleData = updateRuleData(null, props.selectedRule);
    props.onUpdateRule(newRuleData, null);
  };

  return (
    <SidePanel
      displayName="ruleEditor"
      isHidden={!props.showPanel}
      handleCloseClick={props.onPanelClosed}
      title={
        <span>
          {props.selectedRule === null
            ? ScheduleManagerStrings[StringTemplates.NEW_RULE_TITLE]
            : ScheduleManagerStrings[StringTemplates.EDIT_RULE_TITLE]}
        </span>
      }
    >
      <Box padding="space60">
        <Stack orientation="vertical" spacing="space80">
          <>
            <Label htmlFor="name" required>
              {ScheduleManagerStrings[StringTemplates.NAME]}
            </Label>
            <Input id="name" name="name" type="text" value={name} onChange={handleChangeName} required />
          </>
          <RadioGroup
            name="isOpen"
            value={isOpen ? 'open' : 'closed'}
            legend={ScheduleManagerStrings[StringTemplates.TYPE]}
            onChange={handleIsOpenChange}
            orientation="horizontal"
            required
          >
            <Radio id="open" value="open" name="isOpen">
              {ScheduleManagerStrings[StringTemplates.OPEN]}
            </Radio>
            <Radio id="closed" value="closed" name="isOpen">
              {ScheduleManagerStrings[StringTemplates.CLOSED]}
            </Radio>
          </RadioGroup>
          {!isOpen && (
            <>
              <Label htmlFor="closedReason" required>
                {ScheduleManagerStrings[StringTemplates.CLOSED_REASON]}
              </Label>
              <Input
                id="closedReason"
                name="closedReason"
                type="text"
                value={closedReason}
                onChange={handleChangeClosedReason}
                required
              />
              <HelpText>{ScheduleManagerStrings[StringTemplates.CLOSED_REASON_TEXT]}</HelpText>
            </>
          )}
          <Heading as="h3" variant="heading30">
            {ScheduleManagerStrings[StringTemplates.TIME_SETTINGS_TITLE]}
          </Heading>
          <Checkbox checked={allDay} onChange={handleChangeAllDay} id="allDay" name="allDay">
            {ScheduleManagerStrings[StringTemplates.ALL_DAY]}
          </Checkbox>
          {!allDay && (
            <>
              <Label htmlFor="startTime" required>
                {ScheduleManagerStrings[StringTemplates.START_TIME]}
              </Label>
              <TimePicker id="startTime" name="startTime" value={startTime} onChange={handleChangeStartTime} required />
            </>
          )}
          {!allDay && (
            <>
              <Label htmlFor="endTime" required>
                {ScheduleManagerStrings[StringTemplates.END_TIME]}
              </Label>
              <TimePicker id="endTime" name="endTime" value={endTime} onChange={handleChangeEndTime} required />
            </>
          )}
          <Heading as="h3" variant="heading30">
            {ScheduleManagerStrings[StringTemplates.DATE_SETTINGS_TITLE]}
          </Heading>
          <>
            <Label htmlFor="recurrence" required>
              {ScheduleManagerStrings[StringTemplates.RECURRENCE]}
            </Label>
            <Select id="recurrence" name="recurrence" value={recurrence} onChange={handleChangeRecurrence}>
              <Option value="none" key="recurrenceNone">
                {ScheduleManagerStrings[StringTemplates.RECURRENCE_ONCE]}
              </Option>
              <Option value="daily" key="recurrenceDaily">
                {ScheduleManagerStrings[StringTemplates.RECURRENCE_DAILY]}
              </Option>
              <Option value="weekly" key="recurrenceWeekly">
                {ScheduleManagerStrings[StringTemplates.RECURRENCE_WEEKLY]}
              </Option>
              <Option value="monthly" key="recurrenceMonthly">
                {ScheduleManagerStrings[StringTemplates.RECURRENCE_MONTHLY]}
              </Option>
              <Option value="yearly" key="recurrenceYearly">
                {ScheduleManagerStrings[StringTemplates.RECURRENCE_YEARLY]}
              </Option>
            </Select>
          </>
          {recurrence === 'none' && (
            <>
              <Label htmlFor="singleDate" required>
                {ScheduleManagerStrings[StringTemplates.DATE]}
              </Label>
              <DatePicker
                id="singleDate"
                name="singleDate"
                value={singleDate}
                onChange={handleChangeSingleDate}
                required
              />
            </>
          )}
          {recurrence === 'weekly' && (
            <CheckboxGroup name="dayOfWeek" legend={ScheduleManagerStrings[StringTemplates.DAY_OF_WEEK]} required>
              <Checkbox checked={dowMonday} onChange={handleChangeDow} id="dowMonday" name="dowMonday">
                {ScheduleManagerStrings[StringTemplates.DOW_MONDAY]}
              </Checkbox>
              <Checkbox checked={dowTuesday} onChange={handleChangeDow} id="dowTuesday" name="dowTuesday">
                {ScheduleManagerStrings[StringTemplates.DOW_TUESDAY]}
              </Checkbox>
              <Checkbox checked={dowWednesday} onChange={handleChangeDow} id="dowWednesday" name="dowWednesday">
                {ScheduleManagerStrings[StringTemplates.DOW_WEDNESDAY]}
              </Checkbox>
              <Checkbox checked={dowThursday} onChange={handleChangeDow} id="dowThursday" name="dowThursday">
                {ScheduleManagerStrings[StringTemplates.DOW_THURSDAY]}
              </Checkbox>
              <Checkbox checked={dowFriday} onChange={handleChangeDow} id="dowFriday" name="dowFriday">
                {ScheduleManagerStrings[StringTemplates.DOW_FRIDAY]}
              </Checkbox>
              <Checkbox checked={dowSaturday} onChange={handleChangeDow} id="dowSaturday" name="dowSaturday">
                {ScheduleManagerStrings[StringTemplates.DOW_SATURDAY]}
              </Checkbox>
              <Checkbox checked={dowSunday} onChange={handleChangeDow} id="dowSunday" name="dowSunday">
                {ScheduleManagerStrings[StringTemplates.DOW_SUNDAY]}
              </Checkbox>
            </CheckboxGroup>
          )}
          {recurrence === 'yearly' && (
            <>
              <Label htmlFor="month" required>
                {ScheduleManagerStrings[StringTemplates.MONTH]}
              </Label>
              <Select id="month" name="month" value={month} onChange={handleChangeMonth}>
                <Option value="1" key="month1">
                  {ScheduleManagerStrings[StringTemplates.MONTH_JAN]}
                </Option>
                <Option value="2" key="month2">
                  {ScheduleManagerStrings[StringTemplates.MONTH_FEB]}
                </Option>
                <Option value="3" key="month3">
                  {ScheduleManagerStrings[StringTemplates.MONTH_MAR]}
                </Option>
                <Option value="4" key="month4">
                  {ScheduleManagerStrings[StringTemplates.MONTH_APR]}
                </Option>
                <Option value="5" key="month5">
                  {ScheduleManagerStrings[StringTemplates.MONTH_MAY]}
                </Option>
                <Option value="6" key="month6">
                  {ScheduleManagerStrings[StringTemplates.MONTH_JUN]}
                </Option>
                <Option value="7" key="month7">
                  {ScheduleManagerStrings[StringTemplates.MONTH_JUL]}
                </Option>
                <Option value="8" key="month8">
                  {ScheduleManagerStrings[StringTemplates.MONTH_AUG]}
                </Option>
                <Option value="9" key="month9">
                  {ScheduleManagerStrings[StringTemplates.MONTH_SEP]}
                </Option>
                <Option value="10" key="month10">
                  {ScheduleManagerStrings[StringTemplates.MONTH_OCT]}
                </Option>
                <Option value="11" key="month11">
                  {ScheduleManagerStrings[StringTemplates.MONTH_NOV]}
                </Option>
                <Option value="12" key="month12">
                  {ScheduleManagerStrings[StringTemplates.MONTH_DEC]}
                </Option>
              </Select>
            </>
          )}
          {(recurrence === 'monthly' || recurrence === 'yearly') && (
            <>
              <Label htmlFor="dayOfMonth" required>
                {ScheduleManagerStrings[StringTemplates.DAY_OF_MONTH]}
              </Label>
              <Input
                id="dayOfMonth"
                name="dayOfMonth"
                type="text"
                value={dayOfMonth}
                onChange={handleChangeDayOfMonth}
                required
              />
            </>
          )}
          {recurrence !== 'none' && (
            <Checkbox
              checked={restrictDates}
              onChange={handleChangeRestrictDates}
              id="restrictDates"
              name="restrictDates"
            >
              {ScheduleManagerStrings[StringTemplates.RESTRICT_DATE_RANGE]}
            </Checkbox>
          )}
          {recurrence !== 'none' && restrictDates && (
            <>
              <Label htmlFor="startDate">{ScheduleManagerStrings[StringTemplates.START_DATE]}</Label>
              <DatePicker
                id="startDate"
                name="startDate"
                max={endDate}
                value={startDate}
                onChange={handleChangeStartDate}
              />
            </>
          )}
          {recurrence !== 'none' && restrictDates && (
            <>
              <Label htmlFor="endDate">{ScheduleManagerStrings[StringTemplates.END_DATE]}</Label>
              <DatePicker id="endDate" name="endDate" min={startDate} value={endDate} onChange={handleChangeEndDate} />
            </>
          )}
          {error.length > 0 && <Alert variant="error">{error}</Alert>}
          <Stack orientation="horizontal" spacing="space30">
            <Button variant="primary" onClick={handleSave}>
              {templates.Save()}
            </Button>
            <Button variant="secondary" onClick={handleCopy}>
              {ScheduleManagerStrings[StringTemplates.SAVE_COPY_BUTTON]}
            </Button>
            {props.selectedRule !== null && (
              <Button variant="destructive_secondary" onClick={handleDelete}>
                {ScheduleManagerStrings[StringTemplates.DELETE_BUTTON]}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </SidePanel>
  );
};

export default RuleEditor;
