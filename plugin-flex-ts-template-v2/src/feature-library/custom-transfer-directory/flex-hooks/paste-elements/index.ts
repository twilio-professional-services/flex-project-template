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
  },
  TRANSFER_DIR_COMMON_TOOLTIP: {
    zIndex: 101,
  },
  TRANSFER_DIR_COMMON_ROW_ICON: {
    marginLeft: '0.75rem',
  },
  TRANSFER_DIR_COMMON_ROW_NAME: {
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    width: '162px',
    fontSize: '14px',
  },
  TRANSFER_DIR_COMMON_ROW_BUTTONGROUP: {},
  TRANSFER_DIR_QUEUE_HORIZONTAL_ROW_CONTAINER: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    color: 'inherit',
    background: 'none',
    border: 'none',
    outline: 'none',
    borderStyle: 'none',
    borderWidth: '0px 0px 0px 0px',
    // '-webkit-box-align': 'center',
  },
} as { [key: string]: any };
