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
  CONTACTS_TABLE_WRAPPER: {
    boxShadow: 'none',
  },
  CONTACTS_TABLE_CELL: {
    verticalAlign: 'middle',
    ':focus': {
      boxShadow: 'none',
    },
  },
} as { [key: string]: PasteCustomCSS };
