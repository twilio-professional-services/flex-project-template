import { createCallbackChannel } from "../../feature-library/callback-and-voicemail/flex-hooks/channels/Callback";
import { createVoicemailChannel } from "../../feature-library/callback-and-voicemail/flex-hooks/channels/Voicemail";

const channelsToRegister = [createCallbackChannel, createVoicemailChannel];

export default channelsToRegister;
