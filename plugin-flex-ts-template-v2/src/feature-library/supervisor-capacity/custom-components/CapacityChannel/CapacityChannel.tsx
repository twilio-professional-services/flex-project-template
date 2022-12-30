import React, { useEffect, useState } from 'react';
import {Button} from '@twilio-paste/core/button';
import {Switch} from '@twilio-paste/core/switch';
import {Flex} from '@twilio-paste/core/flex';
import {Input} from '@twilio-paste/core/input';
import {DeleteIcon} from "@twilio-paste/icons/esm/DeleteIcon";
import { WorkerChannelCapacityResponse } from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { getRules } from '../..';

export interface OwnProps {
  isSaving: boolean;
  resetCount: number;
  channelSettingsChanged: (channelSid: string, changed: boolean, available: boolean, capacity: number) => void;
  workerChannel: WorkerChannelCapacityResponse;
}

export default function CapacityChannel(props: OwnProps) {
  const [changed, setChanged] = useState(false);
  const [available, setAvailable] = useState(props.workerChannel.available);
  const [capacity, setCapacity] = useState(String(props.workerChannel.configuredCapacity));
  
  useEffect(() => {
    reset();
  }, [props.workerChannel, props.resetCount]);
  
  useEffect(() => {
    const isChanged = !(available == props.workerChannel.available && capacity == String(props.workerChannel.configuredCapacity));
    setChanged(isChanged);
    
    // notify the parent of the new settings
    props.channelSettingsChanged(props.workerChannel.sid, isChanged, available, parseInt(capacity));
  }, [available, capacity]);
  
  const reset = () => {
    setAvailable(props.workerChannel.available);
    setCapacity(String(props.workerChannel.configuredCapacity));
    setChanged(false);
  }
  
  // Ensure the value is within the allowed limits, adjust if not
  const onCapacityBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    let min;
    let max;
    
    const rules = getRules();
    
    if (rules && rules[props.workerChannel.taskChannelUniqueName]) {
      min = rules[props.workerChannel.taskChannelUniqueName].min;
      max = rules[props.workerChannel.taskChannelUniqueName].max;
    }
    
    let value = parseInt(event.target.value);
    
    if (!min) min = 0;
    if (!max) max = 50;
    
    if (String(value) != event.target.value) {
      // value is not a number
      setCapacity(String(props.workerChannel.configuredCapacity));
      return;
    }
    
    if (value < min) {
      setCapacity(String(min));
    } else if (value > max) {
      setCapacity(String(max));
    }
  }
  
  const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(event.target.value);
    if (String(numValue) == event.target.value) {
      // value is a number
      setCapacity(event.target.value)
    } else {
      setCapacity(String(props.workerChannel.configuredCapacity));
    }
  }
  
  const onAvailableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailable(event.target.checked);
  }
  
  return (
    <Flex margin='space50' vAlignContent='center'>
      <Flex grow>
        <Switch
          checked={available}
          onChange={onAvailableChange}
          disabled={props.isSaving}
          id={"available" + props.workerChannel.sid}
          name={"available" + props.workerChannel.sid}>{props.workerChannel.taskChannelUniqueName}</Switch>
      </Flex>
      { changed && (
        <Flex margin='space30'>
          <Button
            variant='destructive_icon'
            disabled={props.isSaving}
            size='reset'
            onClick={reset}>
            <DeleteIcon decorative={false} title='Restore previous value' />
          </Button>
        </Flex>
      )}
      <Flex width='size10'>
        <Input
          disabled={!available || props.isSaving}
          type="text"
          value={capacity}
          onBlur={onCapacityBlur}
          onChange={onCapacityChange}
        />
      </Flex>
    </Flex>
  )
}
