import { FlexEvent } from '../../../../types/feature-loader';
import { getHoldMusicUrl } from '../../config';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function setCommonPVServiceHoldUrl() {
  // Some features may abort the HoldParticipant action and instead call the serverless service to hold instead
  // This makes the serverless service also use the custom hold URL
  ProgrammableVoiceService.holdUrl = getHoldMusicUrl();
};
