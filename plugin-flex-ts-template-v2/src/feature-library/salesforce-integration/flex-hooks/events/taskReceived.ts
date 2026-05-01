import { FlexEvent } from '../../../../types/feature-loader';
import { getOpenCti } from '../../utils/SfdcHelper';
import { setSoftphonePanelVisibility } from '../../utils/UtilityBarHelper';
import logger from '../../../../utils/logger';
import { isShowPanelAutomaticallyEnabled } from '../../config';

export const eventName = FlexEvent.taskReceived;
export const eventHook = function popPanelOnTaskReceived() {
  if (!isShowPanelAutomaticallyEnabled() || !getOpenCti()) {
    return;
  }

  try {
    setSoftphonePanelVisibility(true);
  } catch (error: any) {
    logger.error('[salesforce-integration] Error calling Open CTI to set softphone panel visibility', error);
  }
};
