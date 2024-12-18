import { FlexEvent } from '../../../../types/feature-loader';
import { registerLoadCRMContainerTabsAction } from '../custom-action/loadCRMContainerTabs';
import { registerSelectCRMContainerTabAction } from '../custom-action/selectCRMContainerTab';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerCRMActions() {
  registerLoadCRMContainerTabsAction();
  registerSelectCRMContainerTabAction();
};
