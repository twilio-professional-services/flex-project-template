import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';

export interface ParkInteractionResponse {
  success: boolean;
  recording: FetchedRecording;
}

class ParkInteractionService extends ApiService {
  parkInteraction = async (
    channelSid: string,
    interactionSid: string,
    participantSid: string,
    conversationSid: string,
    taskSid: string,
    workflowSid: string,
    taskChannelUniqueName: string,
    queueName: string,
    queueSid: string,
    taskAttributes: string,
  ): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        channelSid: encodeURIComponent(channelSid),
        interactionSid: encodeURIComponent(interactionSid),
        participantSid: encodeURIComponent(participantSid),
        conversationSid: encodeURIComponent(conversationSid),
        taskSid: encodeURIComponent(taskSid),
        workflowSid: encodeURIComponent(workflowSid),
        taskChannelUniqueName: encodeURIComponent(taskChannelUniqueName),
        queueName: encodeURIComponent(queueName),
        queueSid: encodeURIComponent(queueSid),
        taskAttributes: encodeURIComponent(taskAttributes),
        workerSid: encodeURIComponent(this.manager.store.getState().flex.worker.worker?.sid ?? ''),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParkInteractionResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/park-interaction/flex/park-interaction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: ParkInteractionResponse) => {
          resolve(resp.recording);
        })
        .catch((error) => {
          console.log('Error parking interaction', error);
          reject(error);
        });
    });
  };
}

export default new ParkInteractionService();
