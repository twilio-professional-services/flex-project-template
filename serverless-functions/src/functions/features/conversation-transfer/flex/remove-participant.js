const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [
  {
    key: 'flexInteractionSid',
    purpose: 'KDxxx sid for inteactions API',
  },
  {
    key: 'flexInteractionChannelSid',
    purpose: 'UOxxx sid for interactions API',
  },
  {
    key: 'flexInteractionParticipantSid',
    purpose: 'UTxxx sid for interactions API',
  },
  {
    key: 'status',
    purpose: 'closed or wrapup',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      flexInteractionSid,
      flexInteractionChannelSid,
      flexInteractionParticipantSid,
      conversationSid,
      conversationParticipantSid,
      status,
    } = event;

    await twilioExecute(context, (client) =>
      client.flexApi.v1
        .interaction(flexInteractionSid)
        .channels(flexInteractionChannelSid)
        .participants(flexInteractionParticipantSid)
        .update({ status }),
    );

    // The participant isn't removed from the conversation when entering wrapup, so do that here
    if (status === 'wrapup' && conversationParticipantSid) {
      await twilioExecute(context, (client) =>
        client.conversations.v1.conversations(conversationSid).participants(conversationParticipantSid).remove(),
      );
    }

    // After leaving, check how many participants are left in the conversation.
    // Why? There is a race condition where the agents may both leave at the same time, so both
    // hit this function rather than taking the normal complete task path. That leaves
    // the interaction open with only one participant--the customer. This is undesirable, because
    // then the customer's next message won't open a new interaction until it is cleaned up in 180 days!
    const participants = await twilioExecute(context, (client) =>
      client.conversations.v1.conversations(conversationSid).participants.list({ limit: 100 }),
    );

    if (participants.data && participants.data.length <= 1) {
      // No other participants. Check for outstanding invites.
      const conversationResult = await twilioExecute(context, (client) =>
        client.conversations.v1.conversations(conversationSid).fetch(),
      );

      let invites = {};

      if (conversationResult?.data?.attributes) {
        const parsedAttrs = JSON.parse(conversationResult.data.attributes);

        if (parsedAttrs.invites) {
          invites = parsedAttrs.invites;
        }
      }

      if (Object.keys(invites).length < 1) {
        // If the customer is alone, and no invites are pending, close it out.
        await twilioExecute(context, (client) =>
          client.flexApi.v1
            .interaction(flexInteractionSid)
            .channels(flexInteractionChannelSid)
            .update({ status: 'closed' }),
        );
      }
    }

    response.setStatusCode(200);
    response.setBody({
      success: true,
    });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
