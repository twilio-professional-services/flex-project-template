import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/TaskList';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  //overrideVoiceTemplateExample(flex, manager);
}

function overrideVoiceTemplateExample(flex: typeof Flex, manager: Flex.Manager) {
  const templates = flex.DefaultTaskChannels.Call.templates;

  flex.DefaultTaskChannels.Call.templates = {
    ...templates,
    TaskListItem: {
      ...templates?.TaskListItem,
      secondLine: (task: Flex.ITask) => {
        return `${task.status === 'wrapping' ? StringTemplates.TaskListItemSecondLineWrap : StringTemplates.TaskListItemSecondLineActive}`;
      },
    },
  }
}
