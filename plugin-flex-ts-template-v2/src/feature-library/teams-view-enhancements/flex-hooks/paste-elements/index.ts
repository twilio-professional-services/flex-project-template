import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  COMPACT_TABLE: {
    padding: 'space20',
  },
  COMPACT_TABLE_BG20: {
    padding: 'space20',
    backgroundColor: 'colorBackgroundDecorative20Weakest',
  },
  COMPACT_TABLE_BG30: {
    padding: 'space20',
    backgroundColor: 'colorBackgroundDecorative30Weakest',
  },
} as { [key: string]: PasteCustomCSS };
