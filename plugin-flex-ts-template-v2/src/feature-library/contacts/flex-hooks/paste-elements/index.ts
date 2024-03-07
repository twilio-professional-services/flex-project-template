import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  COMPACT_MODAL: {
    width: '400px',
  },
  CONTACTS_VIEW_WRAPPER: {
    height: '100%',
    padding: 'space40',
    overflow: 'auto',
  },
} as { [key: string]: PasteCustomCSS };
