import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, ITask, withTaskContext } from '@twilio/flex-ui';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Stack } from '@twilio-paste/core/stack';
import { TextArea } from '@twilio-paste/core/textarea';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { Box } from '@twilio-paste/core/box';
import { debounce } from 'lodash';

import { getDispositionsForQueue, isNotesEnabled, isRequireDispositionEnabled } from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { updateDisposition, DispositionsState } from '../../flex-hooks/states';

export interface OwnProps {
  task?: ITask;
}

const DispositionTab = (props: OwnProps) => {
  const NOTES_MAX_LENGTH = 100;
  const [disposition, setDisposition] = useState(props.task?.attributes?.conversations?.outcome ?? '');
  const [notes, setNotes] = useState(props.task?.attributes?.conversations?.content ?? '');

  const dispatch = useDispatch();
  const { tasks } = useSelector((state: AppState) => state[reduxNamespace].dispositions as DispositionsState);

  // TODO: Manager strings

  const updateStore = () => {
    if (!props.task) return;

    let payload = {
      taskSid: props.task.taskSid,
      disposition: '',
      notes: '',
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

    dispatch(updateDisposition(payload));
  };

  const updateStoreDebounced = debounce(updateStore, 250, { maxWait: 1000 });

  useEffect(() => {
    if (tasks && props.task && tasks[props.task.taskSid]) {
      if (tasks[props.task.taskSid].disposition) {
        setDisposition(tasks[props.task.taskSid].disposition);
      }

      if (isNotesEnabled() && tasks[props.task.taskSid].notes) {
        setNotes(tasks[props.task.taskSid].notes);
      }
    }
  }, []);

  useEffect(() => {
    if (!disposition) return;
    updateStore();
  }, [disposition]);

  useEffect(() => {
    if (!isNotesEnabled()) return;
    updateStoreDebounced();
  }, [notes]);

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

  return (
    <Box padding="space80">
      <Stack orientation="vertical" spacing="space80">
        <RadioGroup
          name={`${props.task?.sid}-disposition`}
          value={disposition}
          legend="Select a disposition"
          helpText="The selected disposition will be saved when you complete this task."
          onChange={(value) => setDisposition(value)}
          required={isRequireDispositionEnabled()}
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
        {isNotesEnabled() && (
          <>
            <Label htmlFor="notes">Notes</Label>
            <TextArea
              onChange={(e) => setNotes(e.target.value)}
              aria-describedby="notes_help_text"
              id={`${props.task?.sid}-notes`}
              name={`${props.task?.sid}-notes`}
              value={notes}
              maxLength={NOTES_MAX_LENGTH}
            />
            <HelpText id="notes_help_text">{NOTES_MAX_LENGTH - notes.length} characters remaining</HelpText>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default withTaskContext(DispositionTab);
