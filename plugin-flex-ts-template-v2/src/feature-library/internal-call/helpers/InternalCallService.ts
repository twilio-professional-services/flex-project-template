import { ITask, WorkerAttributes } from '@twilio/flex-ui';
import { Reservation } from 'types/task-router';

import ApiService from '../../../utils/serverless/ApiService';
import logger from '../../../utils/logger';

class InternalCallService extends ApiService {
  acceptInternalTask = async (reservation: Reservation, taskSid: string) => {
    const { contact_uri: from_uri } = this.manager.workerClient?.attributes as WorkerAttributes;
    const { caller_id } = this.manager.serviceConfiguration.outbound_call_flows.default;

    let from = reservation.task.attributes.from;
    if (from_uri.includes('sip:')) {
      from = caller_id;
    }

    if (typeof reservation.task.attributes.conference === 'undefined') {
      reservation.call(
        from,
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/common/agent-outbound-join?taskSid=${taskSid}`,
        {
          accept: true,
        },
      );
    } else {
      reservation.call(
        from,
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/common/agent-join-conference?conferenceName=${reservation.task.attributes.conference.friendlyName}`,
        {
          accept: true,
        },
      );
    }
  };

  rejectInternalTask = async (task: ITask) => {
    const encodedParams = {
      taskSid: task.taskSid,
      conferenceSid: task.attributes.conference?.sid,
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      const response = await this.fetchJsonWithReject(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/flex/cleanup-rejected-task`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      logger.info('[internal-call] Outbound task has been placed into wrapping');
      return response;
    } catch (error: any) {
      logger.error('[internal-call] Unable to place outbound task into wrapping', error);
      throw error;
    }
  };
}

const internalCallService = new InternalCallService();

export default internalCallService;
