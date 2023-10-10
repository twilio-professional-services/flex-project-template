import { useEffect, useState } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { FormControl } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { Select, Option } from '@twilio-paste/core/select';
import { Paragraph } from '@twilio-paste/core/paragraph';

import AppState from '../../../../types/manager/AppState';

interface OwnProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

const ActivityHandlerAdmin = (props: OwnProps) => {
  const [available, setAvailable] = useState(props.initialConfig?.system_activity_names?.available ?? '');
  const [onATask, setOnATask] = useState(props.initialConfig?.system_activity_names?.onATask ?? '');
  const [onATaskNoAcd, setOnATaskNoAcd] = useState(props.initialConfig?.system_activity_names?.onATaskNoAcd ?? '');
  const [wrapup, setWrapup] = useState(props.initialConfig?.system_activity_names?.wrapup ?? '');
  const [wrapupNoAcd, setWrapupNoAcd] = useState(props.initialConfig?.system_activity_names?.wrapupNoAcd ?? '');

  const { activities } = useFlexSelector((state: AppState) => state.flex.worker);

  const setAllowSave = () => {
    if (!available || !onATask || !onATaskNoAcd || !wrapup || !wrapupNoAcd) {
      props.setAllowSave(props.feature, false);
    } else {
      props.setAllowSave(props.feature, true);
    }
  };

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      system_activity_names: {
        ...props.initialConfig?.system_activity_names,
        available,
        onATask,
        onATaskNoAcd,
        wrapup,
        wrapupNoAcd,
      },
    });
  }, [available, onATask, onATaskNoAcd, wrapup, wrapupNoAcd]);

  return (
    <>
      <Paragraph key="activity-help-text" marginBottom="space0">
        Select the activities that represent each agent state:
      </Paragraph>
      <FormControl key="available-control">
        <Label htmlFor="available" required>
          Available
        </Label>
        <Select
          id="available"
          name="available"
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          required
        >
          <Option value="" disabled>
            Select an activity...
          </Option>
          {[...activities].map((entry) => {
            const activity = entry[1];
            if (!activity.available) return <></>;

            return <Option value={activity.name}>{activity.name}</Option>;
          })}
        </Select>
      </FormControl>
      <FormControl key="onatask-control">
        <Label htmlFor="onatask" required>
          On a Task
        </Label>
        <Select id="onatask" name="onatask" value={onATask} onChange={(e) => setOnATask(e.target.value)} required>
          <Option value="" disabled>
            Select an activity...
          </Option>
          {[...activities].map((entry) => {
            const activity = entry[1];
            if (!activity.available) return <></>;

            return <Option value={activity.name}>{activity.name}</Option>;
          })}
        </Select>
      </FormControl>
      <FormControl key="wrapup-control">
        <Label htmlFor="wrapup" required>
          Wrap Up
        </Label>
        <Select id="wrapup" name="wrapup" value={wrapup} onChange={(e) => setWrapup(e.target.value)} required>
          <Option value="" disabled>
            Select an activity...
          </Option>
          {[...activities].map((entry) => {
            const activity = entry[1];
            if (!activity.available) return <></>;

            return <Option value={activity.name}>{activity.name}</Option>;
          })}
        </Select>
      </FormControl>
      <FormControl key="onatasknoacd-control">
        <Label htmlFor="onatasknoacd" required>
          On a Task, No ACD
        </Label>
        <Select
          id="onatasknoacd"
          name="onatasknoacd"
          value={onATaskNoAcd}
          onChange={(e) => setOnATaskNoAcd(e.target.value)}
          required
        >
          <Option value="" disabled>
            Select an activity...
          </Option>
          {[...activities].map((entry) => {
            const activity = entry[1];
            if (activity.available) return <></>;

            return <Option value={activity.name}>{activity.name}</Option>;
          })}
        </Select>
      </FormControl>
      <FormControl key="wrapupnoacd-control">
        <Label htmlFor="wrapupnoacd" required>
          Wrap Up, No ACD
        </Label>
        <Select
          id="wrapupnoacd"
          name="wrapupnoacd"
          value={wrapupNoAcd}
          onChange={(e) => setWrapupNoAcd(e.target.value)}
          required
        >
          <Option value="" disabled>
            Select an activity...
          </Option>
          {[...activities].map((entry) => {
            const activity = entry[1];
            if (activity.available) return <></>;

            return <Option value={activity.name}>{activity.name}</Option>;
          })}
        </Select>
      </FormControl>
    </>
  );
};

export default ActivityHandlerAdmin;
