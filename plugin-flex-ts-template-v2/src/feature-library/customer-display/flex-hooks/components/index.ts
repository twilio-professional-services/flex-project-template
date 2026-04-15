import React from 'react';
import * as Flex from '@twilio/flex-ui';
import CustomerDisplayPanel from '../../custom-components/CustomerDisplayPanel';

export const componentHook = function addCustomerDisplayToTaskInfoPanel(flex: typeof Flex, manager: Flex.Manager) {
  /**
   * Inject CustomerDisplayPanel at the bottom of TaskInfoPanel
   * High sortOrder ensures it appears at the bottom
   */
  flex.TaskInfoPanel.Content.add(React.createElement(CustomerDisplayPanel, { key: 'customer-display-view' }), {
    sortOrder: 1000,
  });
};
