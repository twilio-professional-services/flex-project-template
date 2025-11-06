import ApiService from '../../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../../types/serverless';
import { FetchedReservation } from '../../../../types/serverless/twilio-api';
import logger from '../../../../utils/logger';

interface UpdateReservationResponse {
  success: boolean;
  reservation: FetchedReservation;
  message?: string;
}

class SupervisorCompleteReservationService extends ApiService {
  updateReservation = async (taskSid: string, reservationSid: string, status: string): Promise<FetchedReservation> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      reservationSid: encodeURIComponent(reservationSid),
      status: encodeURIComponent(status),
    };
    try {
      const { reservation } = await this.fetchJsonWithReject<UpdateReservationResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/supervisor-complete-reservation/flex/update-reservation`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return { ...reservation, taskSid };
    } catch (error: any) {
      logger.error('[supervisor-complete-reservation] Error updating reservation', error);
      // eslint-disable-next-line no-throw-literal
      throw { taskSid, error };
    }
  };
}

export default new SupervisorCompleteReservationService();
