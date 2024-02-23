import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  EXTENDED_WRAPUP_BUTTON: {
    alignSelf: 'center',
    marginLeft: 'space30',
    marginRight: 'space30',
  },
} as { [key: string]: PasteCustomCSS };
