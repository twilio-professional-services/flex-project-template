import ApiService from '../../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../../types/serverless';
import { FetchedReservation } from '../../../../types/serverless/twilio-api';

interface UpdateReservationResponse {
  success: boolean;
  reservation: FetchedReservation;
  message?: string;
}

class SupervisorCompleteReservationService extends ApiService {
  updateReservation = async (taskSid: string, reservationSid: string, status: string): Promise<FetchedReservation> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.user.token),
        taskSid: encodeURIComponent(taskSid),
        reservationSid: encodeURIComponent(reservationSid),
        status: encodeURIComponent(status),
      };

      this.fetchJsonWithReject<UpdateReservationResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/supervisor-complete-reservation/flex/update-reservation`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response: UpdateReservationResponse) => {
          resolve({ ...response.reservation, taskSid });
        })
        .catch((error) => {
          console.log('Error updating reservation', error);
          reject({ taskSid, error });
        });
    });
  };
}

export default new SupervisorCompleteReservationService();
