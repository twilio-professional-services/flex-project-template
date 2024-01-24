import * as Flex from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import React from 'react';

import { FlexComponent } from '../../../../types/feature-loader';
import WorkerCanvasTabs from '../../custom-components/WorkerCanvasTabs/WorkerCanvasTabs';

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addWorkerCanvasTabs(flex: typeof Flex, _manager: Flex.Manager) {
  // Remove Agent Details header
  flex.WorkerCanvas.Content.remove('profile-title');
  // Remove Skills Caption and Workerskills
  flex.WorkerCanvas.Content.remove('skills-title');
  flex.WorkerCanvas.Content.remove('skills');

  flex.WorkerCanvas.Content.addWrapper((OriginalComponent) => (originalProps) => {
    // preserve the fragments from the WorkerCanvas
    const fragments = flex.WorkerCanvas.Content.fragments
      .concat([])
      .toSorted((a, b) => (a.props.sortOrder || 10000) - (b.props.sortOrder || 9999));

    // remove the fragments from the WorkerCanvas to prevent vertical rendering
    fragments.forEach((fragment) => {
      if (fragment?.props?.children && (fragment.props.children as React.ReactElement).key) {
        const key = (fragment.props.children as React.ReactElement).key as string;
        flex.WorkerCanvas.Content.remove(key);
      }
    });

    return (
      <>
        <Box>
          <OriginalComponent {...originalProps} />
          <WorkerCanvasTabs key="worker-canvas-tabs" worker={originalProps.worker} fragments={fragments} />
        </Box>
      </>
    );
  });
};
