import { ITask } from '@twilio/flex-ui';

import ApiService from '../../../utils/serverless/ApiService';
import logger from '../../../utils/logger';

class InternalCallService extends ApiService {
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
