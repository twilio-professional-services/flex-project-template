import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  CRM_TAB_PANEL: {
    overflowY: 'scroll',
    display: 'flex',
    flex: '1 0 auto',
    width: '100%',
    borderRadius: 'borderRadius0',
  },
  CRM_TAB_PANELS: {
    display: 'flex',
    flex: '1 0 auto',
    width: '100%',
  },
  CRM_TABS: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    width: '100%',
  },
  CRM_TAB_LIST_CHILD: {
    marginBottom: 'space0',
  },
  CRM_FLEX: {
    alignItems: 'stretch',
    overflow: 'auto',
  },
} as { [key: string]: PasteCustomCSS };
