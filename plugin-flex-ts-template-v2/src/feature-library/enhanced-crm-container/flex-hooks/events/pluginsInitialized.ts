import { FlexEvent } from '../../../../types/feature-loader';
import { registerLoadCRMContainerTabsAction } from '../custom-action/loadCRMContainerTabs';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerCRMAction() {
  registerLoadCRMContainerTabsAction();
};
