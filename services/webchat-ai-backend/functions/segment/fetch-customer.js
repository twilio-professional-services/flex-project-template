const Helpers = require(Runtime.getFunctions()["helpers/index"].path);

exports.handler = async (context, event, callback) => {
  const helpers = new Helpers(context, event);
  try {
    let { trigger } = event;
    trigger = JSON.parse(trigger);
    const email = trigger.conversation
      ? JSON.parse(trigger.conversation.Attributes)?.email
      : null;
    const from = trigger.conversation?.From || trigger?.call.From;

    let kcUser = null;
    if (email || trigger.conversation?.Source === "EMAIL")
      kcUser = await helpers.kc.fetchUserByEmail(
        encodeURIComponent(email || from)
      );
    else {
      let phone = from.replace("whatsapp:", "");
      const [region, number] = [phone.slice(0, 5), phone.slice(5)];

      //normalize wpp BR number
      if (region.startsWith("+55") && phone.length === 13) {
        phone = `${region}9${number}`;
      }

      kcUser = await helpers.kc.fetchUserByQuery(
        "phone",
        encodeURIComponent(phone)
      );
    }

    const segmentId = kcUser.map((user) => user.attributes.segmentPersonaId[0]);

    const segmentTraits = await helpers.segment.fetchUser(
      "user_id",
      ...segmentId
    );

    callback(null, segmentTraits);
  } catch (error) {
    console.error(error);
    const errorResponse = helpers.twilio.internalServerError(error.message);
    callback(null, errorResponse);
  }
};
