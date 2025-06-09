import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import React from 'react';

const PLUGIN_NAME = 'FlexTSTemplatePlugin';

export default class FlexTSTemplatePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex: typeof Flex, manager: Flex.Manager) {
    // Use a simpler approach to customize the TaskListItem
    // Use type assertion to bypass TypeScript error
    (flex.TaskListItem.defaultProps as any).firstLine = (task: Flex.ITask) => {
      console.log('Task attributes:', JSON.stringify(task.attributes, null, 2));
      
      const firstname = task.attributes.firstname || '';
      const lastname = task.attributes.lastname || '';
      const name = [firstname, lastname].filter(Boolean).join(' ');
      
      return name || task.defaultFrom || 'Unknown Caller';
    };
  }
}
