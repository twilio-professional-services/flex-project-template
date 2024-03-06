import { FlexEvent } from '../../../../types/feature-loader';
import { registerExtendWrapUpAction } from '../custom-actions/ExtendWrapUp';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function registerExtendWrapUpActionOnInit() {
  registerExtendWrapUpAction();
};
