import { ITask } from '@twilio/flex-ui';
import { Reservation } from 'types/task-router';

import ApiService from '../../../utils/serverless/ApiService';

class InternalCallService extends ApiService {
  acceptInternalTask = async (reservation: Reservation, taskSid: string) => {
    if (typeof reservation.task.attributes.conference === 'undefined') {
      reservation.call(
        reservation.task.attributes.from,
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/common/agent-outbound-join?taskSid=${taskSid}`,
        {
          accept: true,
        },
      );
    } else {
      reservation.call(
        reservation.task.attributes.from,
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/common/agent-join-conference?conferenceName=${reservation.task.attributes.conference.friendlyName}`,
        {
          accept: true,
        },
      );
    }
  };

  rejectInternalTask = async (task: ITask) => {
    await (task.sourceObject as Reservation).accept();
    await task.wrapUp();
    await task.complete();

    return new Promise((resolve, reject) => {
      const taskSid = task.attributes.conferenceSid;

      const encodedParams = {
        taskSid,
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/flex/cleanup-rejected-task`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response) => {
          console.log('Outbound call has been placed into wrapping');
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
}

const internalCallService = new InternalCallService();

export default internalCallService;
