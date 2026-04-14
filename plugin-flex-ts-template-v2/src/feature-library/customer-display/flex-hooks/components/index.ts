/**
 * Customer Display - Component Injection Hook
 * Injects CustomerDisplayPanel into TaskInfoPanel
 */

import React from 'react';
import * as Flex from '@twilio/flex-ui';
import CustomerDisplayPanel from '../../custom-components/CustomerDisplayPanel';

export const componentHook = function addCustomerDisplayToTaskInfoPanel(flex: typeof Flex, _manager: Flex.Manager) {
  /**
   * Inject CustomerDisplayPanel at the bottom of TaskInfoPanel
   * High sortOrder ensures it appears at the bottom
   */
  flex.TaskInfoPanel.Content.add(React.createElement(CustomerDisplayPanel, { key: 'customer-display-panel' }), {
    sortOrder: 1000,
  });
};
