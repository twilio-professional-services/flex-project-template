import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

const PLUGIN_NAME = 'FlexTSTemplatePlugin';

export default class FlexTSTemplatePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex: typeof Flex, manager: Flex.Manager) {
    // This disables type-checking for the replace function but WORKS
    (flex.TaskListItem.Content as any).replace((props: any) => {
      const { task } = props;
      console.log('Task attributes:', JSON.stringify(task.attributes, null, 2)); // More detailed logging
      
      // Access the profile data correctly based on how it's passed from Studio
      const profile = task.attributes.profile || {};
      const firstname = profile.firstname || '';
      const lastname = profile.lastname || '';
      
      const name = [firstname, lastname].filter(Boolean).join(' ') || 'Unknown Caller';

      return (
        <div>
          <strong>{name}</strong>
        </div>
      );
    });
  }
}
