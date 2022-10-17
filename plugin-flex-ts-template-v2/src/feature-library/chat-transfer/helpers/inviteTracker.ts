import { ITask, StateHelper, Manager } from "@twilio/flex-ui";
import { InvitedParticipantDetails } from "../types/InvitedParticipantDetails";
import { ParticipantInviteType } from "../types/ParticipantInvite";

const syncClient = Manager.getInstance()?.insightsClient;

const instantQuery = async (
  targetSid: string,
  targetType: ParticipantInviteType
) => {
  return new Promise<string>((resolve, reject) => {
    const index = targetType === "Worker" ? "tr-worker" : "tr-queue";

    syncClient.instantQuery(index).then((q) => {
      const search =
        targetType === "Worker"
          ? `data.worker_sid eq "${targetSid}"`
          : `data.queue_sid eq "${targetSid}"`;

      q.search(search);

      q.on("searchResult", (items) => {
        if (items) {
          Object.entries(items).forEach(([key, value]) => {
            console.log("instantQuery", key, value);
            const name =
              targetType === "Worker"
                ? (value as any).attributes.full_name
                : (value as any).queue_name;
            resolve(name);
          });
        } else {
          console.log(
            "Invite participant name instantQuery failed for ",
            targetSid
          );
        }
      });
    });
  });
};

const getWorkerName = (sid: string): Promise<string> => {
  return instantQuery(sid, "Worker");
};

const getQueueName = (sid: string): Promise<string> => {
  return instantQuery(sid, "Queue");
};

export const addInviteToConversation = async (
  task: ITask,
  invitesTaskSid: string,
  targetSid: string
) => {
  const inviteTargetType = targetSid.startsWith("WK") ? "Worker" : "Queue";
  const targetName = await (targetSid.startsWith("WK")
    ? getWorkerName(targetSid)
    : getQueueName(targetSid));

  console.log("addInviteToConversation", targetName);
  const invite: InvitedParticipantDetails = {
    invitesTaskSid,
    targetSid,
    timestampCreated: new Date(),
    targetName,
    inviteTargetType,
  };

  const conversationState = StateHelper.getConversationStateForTask(task);
  if (!conversationState?.source) return;

  const conversation = conversationState?.source;
  const currentAttributes = conversation.attributes;
  const updatedAttributes = {
    ...currentAttributes,
    invites: { ...currentAttributes?.invites, [invitesTaskSid]: invite },
  };
  conversation.updateAttributes(updatedAttributes);
};
