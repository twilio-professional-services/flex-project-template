import logger from '../../../utils/logger';
import { getSfdcBaseUrl } from './SfdcHelper';

// This class is intended as a drop-in replacement for Open CTI, so that existing plugin integration logic can run as-is after Salesforce removes Open CTI support.
class OpenCtiShim {
  CALL_TYPE = {
    OUTBOUND: 'outbound',
    INBOUND: 'inbound',
    INTERNAL: 'internal',
  };

  // Unused - SOBJECT is the only implemented screen pop type
  SCREENPOP_TYPE = {
    FLOW: 'flow',
    LIST: 'list',
    NEW_RECORD_MODAL: 'newRecord',
    OBJECTHOME: 'objecthome',
    SEARCH: 'search',
    SOBJECT: 'sobject',
    URL: 'url',
  };

  clickToDialListener?: (response: any) => void;

  getUtilityVisibleListener?: (response: any) => void;

  searchResultsListeners: Map<string, (response: any) => void> = new Map();

  init() {
    window.addEventListener('message', async (event) => {
      if (!event.origin.includes('salesforce.com') && !event.origin.includes('force.com')) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'clickToDial':
          if (this.clickToDialListener) {
            this.clickToDialListener(data);
          } else {
            logger.warn('[salesforce-integration] No click-to-dial listener is registered.');
          }
          break;
        case 'searchResults':
          const { results, searchId } = data;
          const returnValue: any = {};

          for (const result of results) {
            // Massage structure to mimic Open CTI
            returnValue[result.Id] = result;
          }

          const listener = this.searchResultsListeners.get(searchId);
          if (listener) {
            listener({
              success: true,
              returnValue,
            });
            this.searchResultsListeners.delete(searchId);
          } else {
            logger.warn('[salesforce-integration] No search results listener is registered for the received search.');
          }
          break;
        case 'getUtilityVisible':
          const { visible } = data;
          if (this.getUtilityVisibleListener) {
            this.getUtilityVisibleListener({
              success: true,
              returnValue: {
                visible,
              },
            });
            this.getUtilityVisibleListener = undefined;
          } else {
            logger.warn('[salesforce-integration] No visibility listener is registered.');
          }
          break;
        default:
          logger.warn('[salesforce-integration] Unknown message received', event.data);
      }
    });
  }

  disableClickToDial(params: { callback: (response: any) => { success: boolean } }) {
    // Do nothing other than return success
    params?.callback({
      success: true,
    });
  }

  enableClickToDial(params: { callback: (response: any) => { success: boolean } }) {
    // Do nothing other than return success
    params?.callback({
      success: true,
    });
  }

  onClickToDial(params: { listener: (response: any) => void }) {
    this.clickToDialListener = params?.listener;
  }

  saveLog(params: { value: any; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'activityLog',
        data: params.value,
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  screenPop(params: { params: any; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'screenPop',
        data: {
          recordId: params.params.recordId,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  searchAndScreenPop(params: { searchParams: string; reservationSid: string; callback: (response: any) => void }) {
    let id;
    while (!id || this.searchResultsListeners.has(id)) {
      id = Math.round(Math.random() * 1000).toString();
    }
    this.searchResultsListeners.set(id, params?.callback);
    window.parent.postMessage(
      {
        type: 'screenPop',
        data: {
          searchParams: params.searchParams,
          searchId: id,
        },
      },
      getSfdcBaseUrl(),
    );
  }

  setSoftphoneItemIcon(params: { key: string; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setUtilityIcon',
        data: {
          key: params.key,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  setSoftphoneItemLabel(params: { label: string; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setUtilityLabel',
        data: {
          label: params.label,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  setSoftphonePanelHeight(params: { heightPX: number; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setPanelHeight',
        data: {
          height: params.heightPX,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  setSoftphonePanelIcon(params: { key: string; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setPanelIcon',
        data: {
          key: params.key,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  setSoftphonePanelLabel(params: { label: string; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setPanelLabel',
        data: {
          label: params.label,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  setSoftphonePanelWidth(params: { widthPX: number; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setPanelWidth',
        data: {
          width: params.widthPX,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  isSoftphonePanelVisible(params: { callback: (response: any) => void }) {
    this.getUtilityVisibleListener = params?.callback;
    window.parent.postMessage(
      {
        type: 'getUtilityVisible',
      },
      getSfdcBaseUrl(),
    );
  }

  setSoftphonePanelVisibility(params: { visible: string; callback: (response: any) => void }) {
    window.parent.postMessage(
      {
        type: 'setUtilityVisible',
        data: {
          visible: params?.visible,
        },
      },
      getSfdcBaseUrl(),
    );

    params?.callback({
      success: true,
    });
  }

  getAppViewInfo() {
    logger.warn('[salesforce-integration] getAppViewInfo is not implemented in the Open CTI shim.');
  }

  getCallCenterSettings() {
    logger.warn('[salesforce-integration] getCallCenterSettings is not implemented in the Open CTI shim.');
  }

  getSoftphoneLayout() {
    logger.warn('[salesforce-integration] getSoftphoneLayout is not implemented in the Open CTI shim.');
  }

  notifyInitializationComplete() {
    logger.warn('[salesforce-integration] notifyInitializationComplete is not implemented in the Open CTI shim.');
  }

  onNavigationChange() {
    logger.warn('[salesforce-integration] onNavigationChange is not implemented in the Open CTI shim.');
  }

  refreshView() {
    // Unimplemented - the LWC handles refresh after saveLog, so no need for a warning.
  }

  runApex() {
    logger.warn('[salesforce-integration] runApex is not implemented in the Open CTI shim.');
  }

  subscribe() {
    logger.warn('[salesforce-integration] LMS subscribe is not implemented in the Open CTI shim.');
  }

  unsubscribe() {
    logger.warn('[salesforce-integration] LMS unsubscribe is not implemented in the Open CTI shim.');
  }

  // Console Integration Toolkit functions below
  setCustomConsoleComponentPopoutable(enabled: boolean, callback: (response: any) => void) {
    window.parent.postMessage(
      {
        type: 'setPopoutable',
        data: {
          enabled,
        },
      },
      getSfdcBaseUrl(),
    );

    callback({
      success: true,
    });
  }
}

export const init = () => {
  const shim = new OpenCtiShim();
  shim.init();
  (window as any).sforce = {
    ...(window as any).sforce,
    opencti: shim,
    console: shim,
  };
};
