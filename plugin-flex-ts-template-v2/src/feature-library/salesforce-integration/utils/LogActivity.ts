import { Manager, ITask, TaskHelper } from '@twilio/flex-ui';

import { getOpenCti } from './SfdcHelper';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { clearChannelNote } from '../flex-hooks/states';
import logger from '../../../utils/logger';
import { isCopilotNotesEnabled } from '../config';

export const saveLog = (task: ITask, event: string, callback: any) => {
  if (!getOpenCti()) {
    return;
  }

  const { channelType } = task;
  const channelName = channelType === 'web' ? 'chat' : channelType;
  const isVoice = TaskHelper.isCallTask(task);
  const { direction } = task.attributes;
  const callType = direction === 'outbound' ? getOpenCti().CALL_TYPE.OUTBOUND : getOpenCti().CALL_TYPE.INBOUND;

  const value = {
    entityApiName: 'Task',
    ActivityDate: task.dateUpdated,
    CallType: callType,
    Description: task.attributes.conversations?.content ?? '',
    Status: 'Completed',
    Subject: `[${event}] ${callType} ${channelName} at ${task.dateUpdated}`,
    Type: callType,
    CallObject: task.attributes.conference?.participants?.worker ?? '',
    CallDisposition: task.attributes.conversations?.outcome ?? '',
    TaskSubtype: isVoice ? 'Call' : 'Task',
  } as any;

  if (isVoice) {
    const phone = direction === 'outbound' ? task.attributes.outbound_to : task.attributes.from;
    if (phone) {
      value.Phone = phone;
    }
  }

  if (
    !task.attributes.sfdcObjectType ||
    task.attributes.sfdcObjectType === 'Contact' ||
    task.attributes.sfdcObjectType === 'Lead'
  ) {
    value.WhoId = task.attributes.sfdcObjectId ?? '';
  } else {
    value.WhatId = task.attributes.sfdcObjectId ?? '';
  }

  if (isCopilotNotesEnabled()) {
    const manager = Manager.getInstance();
    const state = manager.store.getState() as AppState;
    const { channelNotes } = state[reduxNamespace].salesforceIntegration;
    const channelSid = task.conference?.source?.channel?.sid;

    if (channelSid && channelNotes && channelNotes[channelSid]) {
      // Agent copilot wrapup summary is available; use it instead
      // Additional fields are available too (topic, sentiment)
      logger.log('[salesforce-integration] Using agent copilot wrapup summary for call log');
      value.CallDisposition = channelNotes[channelSid].dispositionCode.disposition_code;
      value.Description = channelNotes[channelSid].summary;
      manager.store.dispatch(clearChannelNote(channelSid));
    }
  }

  logger.log('[salesforce-integration] Saving call log', value);

  getOpenCti().saveLog({ value, callback });
};
