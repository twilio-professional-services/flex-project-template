import { FlexEvent } from '../../../../types/feature-loader';
import ContactsUtil from '../../utils/ContactsUtil';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  ContactsUtil.initContacts();
};
