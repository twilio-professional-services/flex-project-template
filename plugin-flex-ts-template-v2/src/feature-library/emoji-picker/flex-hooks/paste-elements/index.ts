import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  EMOJI_PICKER_BUTTON: {
    backgroundColor: 'transparent',
    borderRadius: 'borderRadiusCircle',
    padding: 'space30',
    ':hover:enabled': {
      backgroundColor: 'colorBackgroundStrong',
    },
  },
} as { [key: string]: PasteCustomCSS };
