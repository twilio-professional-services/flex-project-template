import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  EXTENDED_WRAPUP_BUTTON: {
    alignSelf: 'center',
    marginLeft: 'space30',
    marginRight: 'space30',
  },
  WRAPUP_HEADER_CONTAINER: {
    alignItems: 'stretch',
    vAlignContent: 'center',
    overflow: 'hidden',
    paddingTop: 'space30',
    paddingBottom: 'space30',
  },
  WRAPUP_HEADER_TITLE: {
    fontSize: 'fontSize30',
    fontWeight: 'fontWeightBold',
    lineHeight: 'lineHeight20',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    'text-overflow': 'ellipsis',
  },
  WRAPUP_HEADER_COUNTDOWN: {
    color: 'colorTextWeak',
    fontSize: 'fontSize20',
    lineHeight: 'lineHeight10',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    'text-overflow': 'ellipsis',
  },
} as { [key: string]: PasteCustomCSS };
