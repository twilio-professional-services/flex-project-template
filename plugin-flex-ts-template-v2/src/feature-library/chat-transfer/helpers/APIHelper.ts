import { ITask, Manager } from "@twilio/flex-ui";
import TaskService from "../../../utils/serverless/TaskRouter/TaskRouterService";
import { WorkerAttributes } from "@twilio/flex-ui";
import { EncodedParams } from "../../../types/serverless";
import ApiService from "../../../utils/serverless/ApiService";

const manager: any | undefined = Manager.getInstance();

export interface TransferRESTPayload {
  taskSid: string; // sid of task to be transferred
  conversationId: string; // for linking transfer task in insights (CHxxx or WTxxx sid)
  jsonAttributes: string; // string representation of attributes for new task
  transferTargetSid: string; //worker or queue sid
  transferQueueName: string; // only valid if transfer to queue
  ignoreWorkerContactUri: string; // transferring works contact uri so they don't boomerang the task on queue transfer
  flexInteractionSid: string; //KDxxx sid for inteactions API
  flexInteractionChannelSid: string; //UOxxx sid for interactions API
  flexInteractionParticipantSid: string; // UTxxx sid for interactions API for the transferrring agent to remove them from conversation
}

const _getMyParticipantSid = async (
  task: ITask,
  flexInteractionChannelSid: string
): Promise<string | null> => {
  const participants = await task.getParticipants(flexInteractionChannelSid);

  const myParticipant = participants.find(
    (participant: any) =>
      participant.mediaProperties?.identity ===
      manager.conversationsClient.user.identity
  );

  return myParticipant ? myParticipant.participantSid : "";
};

const _queueNameFromSid = async (transferTargetSid: string) => {
  const queues = await TaskService.getQueues();
  const queueResult = queues
    ? queues.find((queue) => {
        return queue.sid === transferTargetSid;
      })
    : null;

  return queueResult?.friendlyName || "";
};

export const buildTransferChatAPIPayload = async (
  task: ITask,
  targetSid: string
): Promise<TransferRESTPayload | null> => {
  const taskSid = task.taskSid;
  const conversationId =
    task.attributes?.conversations?.conversation_id || task.taskSid;
  const jsonAttributes = JSON.stringify(task.attributes);
  const transferTargetSid = targetSid;

  let transferQueueName = "";
  if (transferTargetSid.startsWith("WQ")) {
    transferQueueName = await _queueNameFromSid(transferTargetSid);
    if (!transferQueueName) {
      console.error(
        "Transfer failed. queueNameFromSid failed for",
        transferTargetSid
      );
      return null;
    }
  }

  const { contact_uri: ignoreWorkerContactUri } = manager.workerClient
    .attributes as WorkerAttributes;

  const { flexInteractionSid = null, flexInteractionChannelSid = null } =
    task.attributes;

  if (!flexInteractionSid || !flexInteractionChannelSid) {
    console.error(
      "Transfer failed. Missing flexInteractionSid or flexInteractionChannelSid",
      task.sid
    );
    return null;
  }

  const flexInteractionParticipantSid = await _getMyParticipantSid(
    task,
    flexInteractionChannelSid
  );

  if (!flexInteractionParticipantSid) {
    console.error(
      "Transfer failed. Didn't find flexInteractionPartipantSid",
      task.sid
    );
    return null;
  }

  return {
    taskSid,
    conversationId,
    jsonAttributes,
    transferTargetSid,
    transferQueueName,
    ignoreWorkerContactUri,
    flexInteractionSid,
    flexInteractionChannelSid,
    flexInteractionParticipantSid,
  };
};

export interface TransferRESTResponse {
  success: boolean;
}

class ChatTransferService extends ApiService {
  sendTransferChatAPIRequest = (
    requestPayload: TransferRESTPayload
  ): Promise<TransferRESTResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      taskSid: encodeURIComponent(requestPayload.taskSid),
      conversationId: encodeURIComponent(requestPayload.conversationId),
      jsonAttributes: encodeURIComponent(requestPayload.jsonAttributes),
      transferTargetSid: encodeURIComponent(requestPayload.transferTargetSid),
      transferQueueName: encodeURIComponent(requestPayload.transferQueueName),
      ignoreWorkerContactUri: encodeURIComponent(
        requestPayload.ignoreWorkerContactUri
      ),
      flexInteractionSid: encodeURIComponent(requestPayload.flexInteractionSid),
      flexInteractionChannelSid: encodeURIComponent(
        requestPayload.flexInteractionChannelSid
      ),
      flexInteractionParticipantSid: encodeURIComponent(
        requestPayload.flexInteractionParticipantSid
      ),
    };

    return this.fetchJsonWithReject<TransferRESTResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-transfer-v2-cbm/flex/chat-transfer`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): TransferRESTResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new ChatTransferService();
