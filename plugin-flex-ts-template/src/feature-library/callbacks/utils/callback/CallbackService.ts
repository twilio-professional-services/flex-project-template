import * as Flex from '@twilio/flex-ui';
import ApiService from '../../../../utils/serverless/ApiService';
import { TaskAttributes } from '../../../../types/task-router/Task';
import { CallbackNotification } from '../../flex-hooks/notifications/Callback';

class CallbackService extends ApiService {

  async callCustomerBack(task: Flex.ITask, attempts: number): Promise<Flex.ITask> {

    // Check to see if outbound dialing is enabled on the account
    // as outbound calls won't work unless it is
    const { outbound_call_flows } = this.manager.serviceConfiguration;
    const enabledOutboundFlows = Object.values(outbound_call_flows).filter(flow => flow.enabled);

    if (!enabledOutboundFlows.length) {
      Flex.Notifications.showNotification(CallbackNotification.OutboundDialingNotEnabled);
      throw new Error('Oubound dialing is not enabled');
    } else {
      try {
        // move the inbound callback task to wrapup state
        // this continues to block any inbound calls coming to
        // agent while they wait for outbound call to get placed
        // the outbound call needs to be in a ringing state before it will
        // block on the voice channel which presents a race condition
        const { queueSid } = task;
        const { callBackData, conversations } = task.attributes as TaskAttributes;
        if (callBackData) {

          const { numberToCall: destination, numberToCallFrom: callerId } = callBackData;

          let outboundCallTaskAttributes = {
            ...task.attributes,
            taskType: 'callback-outbound',
            conversations: {
              conversation_id: conversations?.conversation_id || task.taskSid
            },
            autoClose: true,
            parentTask: task.sid,
          } as unknown as TaskAttributes;

          // trigger the outbound call
          await Flex.Actions.invokeAction('StartOutboundCall', {
            destination,
            callerId,
            queueSid,
            taskAttributes: outboundCallTaskAttributes
          });
        }
      } catch (e) {
        if (attempts < 5) {
          // there can be some race conditions on invoking outbound call
          // this helps address them silently
          return await this.callCustomerBack(task, attempts + 1);
        }
        else {
          Flex.Notifications.showNotification(CallbackNotification.ErrorCallingCustomer, {
            customer: task.defaultFrom
          });
          throw e;
        }
      }
    }
    return task;
  }
}

export default new CallbackService();
