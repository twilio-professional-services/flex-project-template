import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, ITask, Template, templates, withTaskContext } from '@twilio/flex-ui';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Stack } from '@twilio-paste/core/stack';
import { TextArea } from '@twilio-paste/core/textarea';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';
import { HelpText } from '@twilio-paste/core/help-text';
import { Box } from '@twilio-paste/core/box';
import { CheckboxGroup, Checkbox } from '@twilio-paste/core/checkbox';
import debounce from 'lodash/debounce';

import {
  getDispositionsForQueue,
  isNotesEnabled,
  isRequireDispositionEnabledForQueue,
  getTextAttributes,
  getSelectAttributes,
  getMultiSelectGroup,
  getQueueMultiSelectGroup,
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
interface BooleanPropsObject {
  [key: string]: boolean;
}

const DispositionTab = ({ task }: OwnProps) => {
  const NOTES_MAX_LENGTH = 100;
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes] = useState('');
  const [customAttributes, setCustomAttributes] = useState({} as StringPropsObject);
  const [groupOptions, setGroupOptions] = useState({} as BooleanPropsObject);
  const [groupOptionsForQueue, setGroupOptionsForQueue] = useState({} as BooleanPropsObject);

  const queueSid = task?.queueSid || '';
  const queueName = task?.queueName || '';
  const textAttributes = getTextAttributes(queueName);
  const selectAttributes = getSelectAttributes(queueName);
  const group = getMultiSelectGroup();
  const groupForQueue = getQueueMultiSelectGroup(queueName);
  const NO_OPTION_SELECTED = 'NoOptionSelected';

  const dispatch = useDispatch();
  const { tasks: tasksFromRedux } = useSelector(
    (state: AppState) => state[reduxNamespace].dispositions as DispositionsState,
  );

  const updateStore = () => {
    if (!task) return;
    const payload = {
      taskSid: task?.taskSid,
      disposition: disposition ? disposition : '',
      notes: notes ? notes : '',
      custom_attributes: { ...customAttributes },
    };
    dispatch(updateDisposition(payload));
  };

  const updateStoreDebounced = debounce(updateStore, 250, { maxWait: 1000 });

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
      const options: BooleanPropsObject = {};
      const optionsString = tasksFromRedux[task.taskSid].custom_attributes[group.conversation_attribute];
      if (optionsString) {
        optionsString.split('|').forEach((opt) => {
          options[opt] = true;
        });
      }
      setGroupOptions(options);

      const optionsForQueue: BooleanPropsObject = {};
      const optionsForQueueString =
        tasksFromRedux[task.taskSid].custom_attributes[groupForQueue.conversation_attribute];
      if (optionsForQueueString) {
        optionsForQueueString.split('|').forEach((opt) => {
          optionsForQueue[opt] = true;
        });
      }
      setGroupOptionsForQueue(optionsForQueue);
    }
  }, [task?.taskSid]);

  useEffect(() => {
    updateStoreDebounced();
  }, [disposition, notes, customAttributes]);

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

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const newOptions = { ...groupOptions, [option]: checked };
    setGroupOptions(newOptions);
    // Convert checked options to a pipe | delimited string
    const checkedOptions: string[] = [];
    Object.keys(newOptions).forEach((opt) => {
      if (newOptions[opt]) checkedOptions.push(opt);
    });
    const attributes = { ...customAttributes, [group.conversation_attribute]: checkedOptions.join('|') };
    setCustomAttributes(attributes);
  };

  const handleCheckboxChangeForQueue = (option: string, checked: boolean) => {
    const newOptions = { ...groupOptionsForQueue, [option]: checked };
    setGroupOptionsForQueue(newOptions);
    // Convert checked options to a pipe | delimited string
    const checkedOptions: string[] = [];
    Object.keys(newOptions).forEach((opt) => {
      if (newOptions[opt]) checkedOptions.push(opt);
    });
    const attributes = { ...customAttributes, [groupForQueue.conversation_attribute]: checkedOptions.join('|') };
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
        {group.options && (
          <div key={group.conversation_attribute}>
            <CheckboxGroup
              orientation="horizontal"
              name={group.conversation_attribute}
              legend={group.form_label}
              helpText={templates[StringTemplates.ChooseOptions]()}
              required={group.required || false}
            >
              {group.options.map((option) => (
                <Checkbox
                  key={option}
                  checked={groupOptions[option] || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCheckboxChange(option, e.target.checked);
                  }}
                  id={option}
                  name={option}
                >
                  {option}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        )}
        {groupForQueue.options && (
          <div key={groupForQueue.conversation_attribute}>
            <CheckboxGroup
              orientation="horizontal"
              name={groupForQueue.conversation_attribute}
              legend={groupForQueue.form_label}
              helpText={templates[StringTemplates.ChooseOptions]()}
              required={groupForQueue.required || false}
            >
              {groupForQueue.options.map((option) => (
                <Checkbox
                  key={option}
                  checked={groupOptionsForQueue[option] || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCheckboxChangeForQueue(option, e.target.checked);
                  }}
                  id={option}
                  name={option}
                >
                  {option}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        )}
        {selectAttributes.map(({ conversation_attribute: id, form_label, options, required }) => (
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
        ))}
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
        {isNotesEnabled() && (
          <>
            <Label htmlFor="notes">
              <Template source={templates[StringTemplates.NotesTitle]} />
            </Label>
            <TextArea
              onChange={(e) => setNotes(e.target.value)}
              aria-describedby="notes_help_text"
              id={`${task?.sid}-notes`}
              name={`${task?.sid}-notes`}
              value={notes}
              maxLength={NOTES_MAX_LENGTH}
            />
            <HelpText id="notes_help_text">
              <Template
                source={templates[StringTemplates.NotesCharactersRemaining]}
                characters={NOTES_MAX_LENGTH - notes.length}
              />
            </HelpText>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default withTaskContext(DispositionTab);
