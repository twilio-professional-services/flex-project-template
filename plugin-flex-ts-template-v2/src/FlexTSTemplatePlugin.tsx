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
      console.log('Task attributes:', task.attributes); // Debug log
      const { firstname, lastname } = (task.attributes ?? {}) as {
        firstname?: string;
        lastname?: string;
      };
      const name = [firstname, lastname].filter(Boolean).join(' ') || 'Unknown Caller';

      return (
        <div>
          <strong>{name}</strong>
        </div>
      );
    });
  }
}
