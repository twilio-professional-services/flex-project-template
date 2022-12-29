import React, { useEffect, useState } from 'react';
import {Button} from '@twilio-paste/core/button';
import {Flex} from '@twilio-paste/core/flex';
import {Stack} from '@twilio-paste/core/stack';
import {Text} from '@twilio-paste/core/text';
import { SectionHeader } from './CapacityContainerStyles';
import TaskRouterService, { WorkerChannelCapacityResponse } from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { IWorker, Manager } from '@twilio/flex-ui';
import { getRules } from '../..';
import CapacityChannel from '../CapacityChannel';

export interface OwnProps {
  worker?: IWorker;
}

export interface ChannelSettings {
  changed: boolean;
  available: boolean;
  capacity: number;
}

const rules = getRules();

export default function CapacityContainer(props: OwnProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [workerChannels, setWorkerChannels] = useState([] as WorkerChannelCapacityResponse[]);
  const [channelSettings, setChannelSettings] = useState({} as { [key: string]: ChannelSettings });
  const [resetCount, setResetCount] = useState(0);
  
  useEffect(() => {
    listChannels();
  }, [props.worker?.sid]);
  
  useEffect(() => {
    let changedChannels = Object.values(channelSettings).find((change) => change.changed);
    
    if (!changedChannels) {
      setChanged(false);
      return;
    }
    
    setChanged(true);
  }, [channelSettings]);
  
  const listChannels = async () => {
    if (!props.worker) return;
    
    setIsLoading(true);
    const channelData = await TaskRouterService.getWorkerChannels(props.worker.sid);
    
    // if configured, filter to configured rules
    if (rules) {
      let filteredChannels = channelData.filter(channel => {
        if (rules[channel.taskChannelUniqueName]) {
          return true;
        }
        return false;
      });
      
      setWorkerChannels(filteredChannels);
    } else {
      setWorkerChannels(channelData);
    }
    
    setIsLoading(false);
  }
  
  const save = async () => {
    setIsSaving(true);
    
    await Promise.all(Object.keys(channelSettings).map((workerChannelSid) => {
      const settings = channelSettings[workerChannelSid];
      
      if (!settings.changed || !props.worker) {
        // only make the API call if something actually changed
        return;
      }
      
      return TaskRouterService.updateWorkerChannel(props.worker.sid, workerChannelSid, settings.capacity, settings.available);
    }));
    
    // fetch what was saved and reset our state
    await listChannels();
    await reset();
    
    setIsSaving(false);
  }
  
  const reset = async () => {
    setChanged(false);
    setChannelSettings({});
    setResetCount(resetCount => resetCount + 1);
  }
  
  /**
   * This function gets passed into CapacityChannel subcomponents. Each 
   * subcomponent can then use it to notify this Component of a change
   * 
   * @param {string}  workerChannelSid - the SID of the changed WorkerChannel
   * @param {boolean} hasChanged - True/False, whether the WorkerChannel has changed
   */
  const channelSettingsChanged = (workerChannelSid: string, hasChanged: boolean, newAvailable: boolean, newCapacity: number) => {
    setChannelSettings(workerChannelChanges => ({
      ...workerChannelChanges,
      [workerChannelSid]: {
        changed: hasChanged,
        available: newAvailable,
        capacity: newCapacity
      }
    }));
  }
  
  return (
    <Stack orientation='vertical' spacing='space0'>
      <SectionHeader>Channel Capacity</SectionHeader>
      { workerChannels.length > 0 && workerChannels.map((workerChannel) => (
        <CapacityChannel
          isSaving={isSaving || isLoading}
          resetCount={resetCount}
          workerChannel={workerChannel}
          channelSettingsChanged={channelSettingsChanged}
          key={workerChannel.sid}
           />
      )) }
      { workerChannels.length > 0 && (!isLoading || isSaving) && (
        <Flex hAlignContent='right' margin='space50'>
          <Stack orientation='horizontal' spacing='space30'>
            <Button
              variant='secondary'
              disabled={!changed || isLoading || isSaving}
              onClick={reset}>
              Reset
            </Button>
            <Button
              variant='primary'
              disabled={!changed || isLoading || isSaving}
              loading={isSaving}
              onClick={save}>
              Save
            </Button>
          </Stack>
        </Flex>
      )}
      { rules && Object.keys(rules).length < 1 && !isLoading && (
        <Text as='p' margin='space50'>Missing configuration. Please notify your system administrator.</Text>
      )}
      { workerChannels.length < 1 && (!rules || Object.keys(rules).length > 0) && !isLoading && (
        <Text as='p' margin='space50'>No worker channels available.</Text>
      )}
      { isLoading && !isSaving && (
        <Text as='p' margin='space50'>Loading...</Text>
      )}
    </Stack>
  )
}
