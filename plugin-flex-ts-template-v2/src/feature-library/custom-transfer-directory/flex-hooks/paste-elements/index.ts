export const pasteElementHook = {
  TRANSFER_DIR_COMMON_TAB_CONTAINER: {
    width: '100%',
    height: '100%',
    fontWeight: '700px',
    overflow: 'hidden',
  },
  TRANSFER_DIR_COMMON_SEARCH_BOX: {
    visibility: 'visible',
  },
  TRANSFER_DIR_COMMON_SEARCH_BOX_PREFIX: {
    padding: '0.4379rem 0.5rem',
  },
  TRANSFER_DIR_COMMON_SEARCH_BOX_ELEMENT: {
    fontWeight: '400',
    '&::placeholder': {
      fontStyle: 'normal',
      opacity: 0.42,
      color: 'currentColor',
    },
    display: 'block',
  },
  TRANSFER_DIR_COMMON_ROWS_CONTAINER: {
    fontWeight: '700',
    overflowY: 'auto',
    alignItems: 'initial',
    width: '100%',
  },
  TRANSFER_DIR_COMMON_TOOLTIP: {
    zIndex: 100,
  },
  TRANSFER_DIR_COMMON_ROW_ICON: {
    marginLeft: 'space30',
    marginRight: 'space40',
    minWidth: 'sizeIcon20',
  },
  TRANSFER_DIR_COMMON_ROW_NAME: {
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    width: '100%',
  },
  TRANSFER_DIR_COMMON_ROW_BUTTON: {
    '&:focus': {
      'box-shadow': 'none',
    },
  },
  TRANSFER_DIR_COMMON_ROW_BUTTONGROUP: {
    display: 'none',
  },
  TRANSFER_DIR_COMMON_HORIZONTAL_ROW_CONTAINER: {
    paddingLeft: 'space30',
    paddingRight: 'space30',
    minHeight: '40px',
    '&:hover span[data-paste-element="TRANSFER_DIR_COMMON_ROW_BUTTONGROUP"]': {
      display: 'inline-flex',
    },
  },
} as { [key: string]: any };
