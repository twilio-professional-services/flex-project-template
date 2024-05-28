import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, ITask, templates, withTaskContext } from '@twilio/flex-ui';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Stack } from '@twilio-paste/core/stack';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';
import { Box } from '@twilio-paste/core/box';
import { CheckboxGroup, Checkbox } from '@twilio-paste/core/checkbox';
import debounce from 'lodash/debounce';

import Notes from '../Notes/Notes';
import {
  getDispositionsForQueue,
  isNotesEnabled,
  isRequireDispositionEnabledForQueue,
  getTextAttributes,
  getSelectAttributes,
} from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import {
  updateDisposition,
  updateNotes,
  updateCustomAttributes,
  DispositionsState,
  DispositionsTaskStringUpdate,
} from '../../flex-hooks/states';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  task?: ITask;
}

const DispositionTab = ({ task }: OwnProps) => {
  // Store notes state locally for debounce
  const [notes, setNotes] = useState('');

  const dispatch = useDispatch();
  const { tasks: tasksFromRedux } = useSelector(
    (state: AppState) => state[reduxNamespace].dispositions as DispositionsState,
  );

  if (!task) {
    return null;
  }

  const taskSid = task.taskSid;
  const queueSid = task.queueSid;
  const queueName = task.queueName;
  const taskFromRedux = tasksFromRedux[taskSid];
  const textAttributes = getTextAttributes(queueSid, queueName);
  const selectAttributes = getSelectAttributes(queueSid, queueName);
  const NO_OPTION_SELECTED = 'NoOptionSelected';

  const updateStoreNotes = (payload: DispositionsTaskStringUpdate) => {
    dispatch(updateNotes(payload));
  };

  const updateStoreNotesDebounced = useCallback(
    debounce((payload) => updateStoreNotes(payload), 250, { maxWait: 1000 }),
    [],
  );

  useEffect(() => {
    if (!taskFromRedux && !notes) {
      // No need to create an empty entry
      return;
    }
    updateStoreNotesDebounced({ taskSid, value: notes });
  }, [notes]);

  useEffect(() => {
    if (!isNotesEnabled()) {
      return;
    }
    setNotes(taskFromRedux?.notes || '');
  }, [task?.taskSid]);

  useEffect(() => {
    // Pop the disposition tab when the task enters wrapping status.
    // We do this here because WrapupTask does not handle a customer-ended task,
    // and doing this in the taskWrapup event seems to not work.
    if (task?.status === 'wrapping') {
      Actions.invokeAction('SetComponentState', {
        name: 'AgentTaskCanvasTabs',
        state: { selectedTabName: 'disposition' },
      });
    }
  }, [task?.status]);

  const setDisposition = (value: string) => {
    dispatch(updateDisposition({ taskSid, value }));
  };

  const setCustomAttributes = (value: { [key: string]: string }) => {
    dispatch(updateCustomAttributes({ taskSid, value }));
  };

  const handleChange = (key: string, value: string) => {
    const attributes = { ...taskFromRedux?.custom_attributes, [key]: value };
    setCustomAttributes(attributes);
  };

  const handleCheckboxChange = (key: string, option: string, checked: boolean) => {
    const currentSelected = taskFromRedux?.custom_attributes && taskFromRedux?.custom_attributes[key];
    const newSelected = currentSelected?.split('|') ?? [];

    if (checked && !newSelected.includes(option)) {
      newSelected.push(option);
    } else if (!checked && newSelected.includes(option)) {
      newSelected.splice(newSelected.indexOf(option), 1);
    }

    const attributes = { ...taskFromRedux?.custom_attributes, [key]: newSelected.join('|') };
    if (!newSelected.length) {
      delete attributes[key];
    }
    setCustomAttributes(attributes);
  };

  return (
    <Box padding="space80" overflowY="auto">
      <Stack orientation="vertical" spacing="space50">
        {getDispositionsForQueue(queueSid, queueName).length > 0 && (
          <RadioGroup
            name={`${task?.sid}-disposition`}
            value={taskFromRedux?.disposition || ''}
            legend={templates[StringTemplates.SelectDispositionTitle]()}
            helpText={templates[StringTemplates.SelectDispositionHelpText]()}
            onChange={(value) => setDisposition(value)}
            required={isRequireDispositionEnabledForQueue(queueSid, queueName)}
          >
            {getDispositionsForQueue(queueSid, queueName).map((disp) => (
              <Radio
                id={`${task?.sid}-disposition-${disp}`}
                value={disp}
                name={`${task?.sid}-disposition`}
                key={`${task?.sid}-disposition-${disp}`}
              >
                {disp}
              </Radio>
            ))}
          </RadioGroup>
        )}
        {selectAttributes.map(({ conversation_attribute: id, form_label, options, required, multi_select }) => {
          if (multi_select) {
            return (
              <div key={id}>
                <CheckboxGroup
                  orientation="horizontal"
                  name={id}
                  legend={form_label}
                  helpText={templates[StringTemplates.ChooseOptions]()}
                  required={required || false}
                >
                  {options.map((option) => (
                    <Checkbox
                      key={option}
                      checked={
                        (taskFromRedux?.custom_attributes && taskFromRedux?.custom_attributes[id]?.includes(option)) ||
                        false
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleCheckboxChange(id, option, e.target.checked);
                      }}
                      id={option}
                      name={option}
                    >
                      {option}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            );
          }
          return (
            <div key={id}>
              <Label htmlFor={id} required={required || false}>
                {form_label}
              </Label>
              <Select
                id={id}
                value={(taskFromRedux?.custom_attributes && taskFromRedux?.custom_attributes[id]) || NO_OPTION_SELECTED}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  if (value !== NO_OPTION_SELECTED) handleChange(id, value);
                }}
              >
                <Option key={NO_OPTION_SELECTED} value={NO_OPTION_SELECTED} disabled>
                  {templates[StringTemplates.ChooseAnOption]()}
                </Option>
                {options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
          );
        })}
        {textAttributes.map(({ conversation_attribute: id, form_label, required }) => (
          <div key={id}>
            <Label htmlFor={id} required={required || false}>
              {form_label}
            </Label>
            <Input
              type="text"
              id={id}
              value={(taskFromRedux?.custom_attributes && taskFromRedux?.custom_attributes[id]) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(id, e.target.value)}
            />
          </div>
        ))}
        {isNotesEnabled() && <Notes task={task} notes={notes || ''} saveNotes={setNotes} />}
      </Stack>
    </Box>
  );
};

export default withTaskContext(DispositionTab);
