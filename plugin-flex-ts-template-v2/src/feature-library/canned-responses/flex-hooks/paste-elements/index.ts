import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  CANNED_RESPONSES_MENU: {
    maxHeight: '70vh',
    height: '100%',
    overflowY: 'scroll',
  },
} as { [key: string]: PasteCustomCSS };
