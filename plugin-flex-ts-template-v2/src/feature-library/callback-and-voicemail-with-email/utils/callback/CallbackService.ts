import * as Flex from '@twilio/flex-ui';

import ApiService from '../../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../../types/serverless';
import { TaskAttributes } from '../../../../types/task-router/Task';
import { CallbackNotification } from '../../flex-hooks/notifications/Callback';
import { Actions } from '../../flex-hooks/states/CallbackAndVoicemail';
import logger from '../../../../utils/logger';

export interface CreateCallbackResponse {
  success: boolean;
  taskSid: string;
  data: string;
  message: string;
}

export interface FetchVoicemailResponse {
  type: string;
  recording: string;
}

class CallbackService extends ApiService {
  async fetchVoicemail(recordingSid: string): Promise<FetchVoicemailResponse> {
    return this.#fetchVoicemail(recordingSid);
  }

  async callCustomerBack(task: Flex.ITask, attempts: number): Promise<Flex.ITask> {
    // Check to see if outbound dialing is enabled on the account
    // as outbound calls won't work unless it is
    const { outbound_call_flows } = this.manager.serviceConfiguration;
    const enabledOutboundFlows = Object.values(outbound_call_flows).filter((flow) => flow.enabled);

    if (enabledOutboundFlows.length) {
      try {
        // update state with the existing reservation sid so that we can re-select it later
        Flex.Manager.getInstance().store.dispatch(Actions.setLastPlacedCallback(task));

        // move the inbound callback task to wrapup state
        // this continues to block any inbound calls coming to
        // agent while they wait for outbound call to get placed
        // the outbound call needs to be in a ringing state before it will
        // block on the voice channel which presents a race condition
        const { queueSid } = task;
        const { callBackData, conversations } = task.attributes as TaskAttributes;
        if (callBackData) {
          const { numberToCall: destination, numberToCallFrom } = callBackData;
          // Don't pass SIP caller IDs, because they cannot be used.
          const callerId = numberToCallFrom && !numberToCallFrom.startsWith('sip:') ? numberToCallFrom : undefined;

          const outboundCallTaskAttributes = {
            ...task.attributes,
            taskType: 'callback-outbound',
            conversations: {
              conversation_id: conversations?.conversation_id || task.taskSid,
            },
            autoClose: true,
            parentTask: task.sid,
          } as unknown as TaskAttributes;

          // trigger the outbound call
          await Flex.Actions.invokeAction('StartOutboundCall', {
            destination,
            callerId,
            queueSid,
            taskAttributes: outboundCallTaskAttributes,
          });
        }
      } catch (e) {
        if (attempts < 5) {
          // there can be some race conditions on invoking outbound call
          // this helps address them silently
          return this.callCustomerBack(task, attempts + 1);
        }
        Flex.Notifications.showNotification(CallbackNotification.ErrorCallingCustomer, {
          customer: task.defaultFrom,
        });
        throw e;
      }
    } else {
      Flex.Notifications.showNotification(CallbackNotification.OutboundDialingNotEnabled);
      throw new Error('Outbound dialing is not enabled');
    }
    return task;
  }

  async requeueCallback(task: Flex.ITask): Promise<Flex.ITask> {
    try {
      const response = await this.#requeueCallback(task.taskSid);

      if (response.success) {
        await Flex.Actions.invokeAction('WrapupTask', { task });
      }
    } catch (error: any) {
      logger.error('[callback-and-voicemail] Unable to requeue callback', error);
    }

    return task;
  }

  #requeueCallback = async (taskSid: string): Promise<CreateCallbackResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
    };

    return this.fetchJsonWithReject<CreateCallbackResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/callback-and-voicemail/flex/requeue-callback`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };

  #fetchVoicemail = async (recordingSid: string): Promise<FetchVoicemailResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      recordingSid: encodeURIComponent(recordingSid),
    };

    return this.fetchJsonWithReject<FetchVoicemailResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/callback-and-voicemail/flex/fetch-voicemail`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };
}

export default new CallbackService();
