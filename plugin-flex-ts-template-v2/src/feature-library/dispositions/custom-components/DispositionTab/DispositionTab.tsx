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
} from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { updateDisposition, DispositionsState } from '../../flex-hooks/states';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  task?: ITask;
}

const DispositionTab = (props: OwnProps) => {
  const NOTES_MAX_LENGTH = 100;
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes] = useState('');
  const [customAttributes, setCustomAttributes] = useState({} as any);
  const [groupOptions, setGroupOptions] = useState({} as any);

  const textAttributes = getTextAttributes(props.task?.queueSid ?? '');
  const selectAttributes = getSelectAttributes(props.task?.queueSid ?? '');
  const group = getMultiSelectGroup();

  const dispatch = useDispatch();
  const { tasks } = useSelector((state: AppState) => state[reduxNamespace].dispositions as DispositionsState);

  const updateStore = () => {
    if (!props.task) return;

    let payload = {
      taskSid: props.task.taskSid,
      disposition: '',
      notes: '',
      custom_attributes: {},
    };

    if (tasks[props.task.taskSid]) {
      payload = {
        ...payload,
        ...tasks[props.task.taskSid],
      };
    }

    if (disposition) {
      payload.disposition = disposition;
    }

    if (isNotesEnabled() && notes) {
      payload.notes = notes;
    }
    payload.custom_attributes = { ...customAttributes };
    dispatch(updateDisposition(payload));
  };

  const updateStoreDebounced = debounce(updateStore, 250, { maxWait: 1000 });

  useEffect(() => {
    if (tasks && props.task && tasks[props.task.taskSid]) {
      if (tasks[props.task.taskSid].disposition) {
        setDisposition(tasks[props.task.taskSid].disposition);
      }

      if (isNotesEnabled()) {
        setNotes(tasks[props.task.taskSid].notes || '');
      }
      // set custom attributes from Redux state
      setCustomAttributes(tasks[props.task.taskSid].custom_attributes);
      const options = {} as any;
      const optionsString = tasks[props.task.taskSid].custom_attributes[group.conversation_attribute] || '';
      optionsString.split('|').forEach((opt) => {
        options[opt] = true;
      });
      setGroupOptions(options);
    }
  }, [props?.task?.taskSid]);

  useEffect(() => {
    if (!disposition) return;
    updateStore();
  }, [disposition]);

  useEffect(() => {
    if (!isNotesEnabled()) return;
    updateStoreDebounced();
  }, [notes]);

  useEffect(() => {
    updateStoreDebounced();
  }, [customAttributes]);

  useEffect(() => {
    // Pop the disposition tab when the task enters wrapping status.
    // We do this here because WrapupTask does not handle a customer-ended task,
    // and doing this in the taskWrapup event seems to not work.
    if (props.task?.status === 'wrapping') {
      Actions.invokeAction('SetComponentState', {
        name: 'AgentTaskCanvasTabs',
        state: { selectedTabName: 'disposition' },
      });
    }
  }, [props.task?.status]);

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

  const NO_OPTION_SELECTED = 'NoOptionSelected';
  return (
    <Box padding="space80" overflowY="scroll">
      <Stack orientation="vertical" spacing="space50">
        {getDispositionsForQueue(props.task?.queueSid ?? '').length > 0 && (
          <RadioGroup
            name={`${props.task?.sid}-disposition`}
            value={disposition}
            legend={templates[StringTemplates.SelectDispositionTitle]()}
            helpText={templates[StringTemplates.SelectDispositionHelpText]()}
            onChange={(value) => setDisposition(value)}
            required={isRequireDispositionEnabledForQueue(props.task?.queueSid ?? '')}
          >
            {getDispositionsForQueue(props.task?.queueSid ?? '').map((disp) => (
              <Radio
                id={`${props.task?.sid}-disposition-${disp}`}
                value={disp}
                name={`${props.task?.sid}-disposition`}
                key={`${props.task?.sid}-disposition-${disp}`}
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
              {group.options.map((option) => {
                return (
                  <Checkbox
                    key={option}
                    checked={groupOptions[option] || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      console.log('Checkbox event:', e);
                      handleCheckboxChange(option, e.target.checked);
                    }}
                    id={option}
                    name={option}
                  >
                    {option}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
          </div>
        )}
        {selectAttributes.map((attr) => {
          const id = attr.conversation_attribute;
          return (
            <div key={id}>
              <Label htmlFor={id} required={attr.required || false}>
                {attr.form_label}
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
                {attr.options.map((option) => {
                  return (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  );
                })}
              </Select>
            </div>
          );
        })}
        {textAttributes.map((attr) => {
          const id = attr.conversation_attribute;
          return (
            <div key={id}>
              <Label htmlFor={id} required={attr.required || false}>
                {attr.form_label}
              </Label>
              <Input
                type="text"
                id={id}
                value={customAttributes[id] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(id, e.target.value)}
              />
            </div>
          );
        })}
        {isNotesEnabled() && (
          <>
            <Label htmlFor="notes">
              <Template source={templates[StringTemplates.NotesTitle]} />
            </Label>
            <TextArea
              onChange={(e) => setNotes(e.target.value)}
              aria-describedby="notes_help_text"
              id={`${props.task?.sid}-notes`}
              name={`${props.task?.sid}-notes`}
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
