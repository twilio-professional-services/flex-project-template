import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  LANG_SELECT_BUTTON: {
    backgroundColor: 'transparent',
    borderRadius: 'borderRadiusCircle',
    padding: 'space20',
    ':hover': {
      backgroundColor: 'colorBackgroundInverseStrong',
    },
  },
  LANG_SELECT_BUTTON_OPEN: {
    backgroundColor: 'colorBackgroundInverseStrong',
    borderRadius: 'borderRadiusCircle',
    padding: 'space20',
  },
} as { [key: string]: PasteCustomCSS };
