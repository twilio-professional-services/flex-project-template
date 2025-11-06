import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  CANNED_RESPONSES_MENU: {
    maxHeight: '65vh',
    maxWidth: '17rem',
    overflowY: 'scroll',
  },
  CANNED_RESPONSES_MENU_BUTTON: {
    backgroundColor: 'transparent',
    borderRadius: 'borderRadiusCircle',
    padding: 'space30',
    ':hover:enabled': {
      backgroundColor: 'colorBackgroundStrong',
    },
  },
} as { [key: string]: PasteCustomCSS };
