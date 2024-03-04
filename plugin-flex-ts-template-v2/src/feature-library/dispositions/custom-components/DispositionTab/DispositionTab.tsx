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
import { updateDisposition, DispositionsState } from '../../flex-hooks/states';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  task?: ITask;
}

interface StringPropsObject {
  [key: string]: string;
}

interface DispositionPayload {
  taskSid: string;
  disposition: string;
  notes: string;
  custom_attributes: { [key: string]: string };
}

const DispositionTab = ({ task }: OwnProps) => {
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes] = useState('');
  const [customAttributes, setCustomAttributes] = useState({} as StringPropsObject);

  const queueSid = task?.queueSid || '';
  const queueName = task?.queueName || '';
  const textAttributes = getTextAttributes(queueSid, queueName);
  const selectAttributes = getSelectAttributes(queueSid, queueName);
  const NO_OPTION_SELECTED = 'NoOptionSelected';

  const dispatch = useDispatch();
  const { tasks: tasksFromRedux } = useSelector(
    (state: AppState) => state[reduxNamespace].dispositions as DispositionsState,
  );

  const payload: DispositionPayload = {
    taskSid: task?.taskSid || '',
    disposition: disposition ? disposition : '',
    notes: notes ? notes : '',
    custom_attributes: { ...customAttributes },
  };

  const updateStore = (payload: DispositionPayload) => {
    dispatch(updateDisposition(payload));
  };

  const updateStoreDebounced = useCallback(
    debounce((payload) => updateStore(payload), 250, { maxWait: 1000 }),
    [],
  );

  useEffect(() => {
    updateStoreDebounced(payload);
  }, [disposition, notes, customAttributes]);

  useEffect(() => {
    if (tasksFromRedux && task && tasksFromRedux[task.taskSid]) {
      if (tasksFromRedux[task.taskSid].disposition) {
        setDisposition(tasksFromRedux[task.taskSid].disposition);
      }

      if (isNotesEnabled()) {
        setNotes(tasksFromRedux[task.taskSid].notes || '');
      }
      // set custom attributes from Redux state
      setCustomAttributes(tasksFromRedux[task.taskSid].custom_attributes);
    }
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

  const handleChange = (key: string, value: string) => {
    const attributes = { ...customAttributes, [key]: value };
    setCustomAttributes(attributes);
  };

  const handleCheckboxChange = (key: string, option: string, checked: boolean) => {
    const currentSelected = customAttributes[key];
    const newSelected = currentSelected?.split('|') ?? [];

    if (checked && !newSelected.includes(option)) {
      newSelected.push(option);
    } else if (!checked && newSelected.includes(option)) {
      newSelected.splice(newSelected.indexOf(option), 1);
    }

    const attributes = { ...customAttributes, [key]: newSelected.join('|') };
    if (!newSelected.length) {
      delete attributes[key];
    }
    setCustomAttributes(attributes);
  };

  return (
    <Box padding="space80" overflowY="scroll">
      <Stack orientation="vertical" spacing="space50">
        {getDispositionsForQueue(queueSid, queueName).length > 0 && (
          <RadioGroup
            name={`${task?.sid}-disposition`}
            value={disposition}
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
                      checked={customAttributes[id]?.includes(option) || false}
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
                value={customAttributes[id] || NO_OPTION_SELECTED}
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
              value={customAttributes[id] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(id, e.target.value)}
            />
          </div>
        ))}
        {isNotesEnabled() && <Notes task={task} notes={notes} saveNotes={setNotes} />}
      </Stack>
    </Box>
  );
};

export default withTaskContext(DispositionTab);
