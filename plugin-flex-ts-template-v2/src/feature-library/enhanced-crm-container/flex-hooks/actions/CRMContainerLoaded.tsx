import EventEmitter from 'events';

import * as Flex from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { LoadingIcon } from '@twilio-paste/icons/esm/LoadingIcon';

import IFrameCRMTab from '../../custom-components/IFrameCRMTab';
import { FlexActionEvent } from '../../../../types/feature-loader';
import { shouldDisplayUrlWhenNoTasks, getUrlTabTitle, isUrlTabEnabled } from '../../config';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addURLTabToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  if (!isUrlTabEnabled()) {
    return;
  }
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task && !shouldDisplayUrlWhenNoTasks()) {
      return;
    }

    const reloadEmitter = new EventEmitter();

    payload.components = [
      ...payload.components,
      {
        title: getUrlTabTitle(),
        component: <IFrameCRMTab reloadEmitter={reloadEmitter} task={payload.task} key="iframe-crm-container" />,
        accessoryComponents: [
          {
            component: (
              <Button
                variant="secondary_icon"
                size="icon_small"
                onClick={() => reloadEmitter.emit('reload')}
                key="iframe-reload-button"
              >
                <LoadingIcon decorative={false} title={manager.strings.IframeReloadButtonLabel} />
              </Button>
            ),
            order: 0,
          },
        ],
      },
    ];
  });
};
