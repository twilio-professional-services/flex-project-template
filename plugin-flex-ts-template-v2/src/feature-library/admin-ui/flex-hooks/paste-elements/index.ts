import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  ADMIN_CODE_TEXTAREA: {
    fontFamily: 'fontFamilyCode',
  },
} as { [key: string]: PasteCustomCSS };
