import { ITask, Template, templates } from '@twilio/flex-ui';
import { CodeBlock } from '@twilio-paste/core/code-block';

import { StringTemplates } from '../../flex-hooks/strings';

interface Props {
  task?: ITask;
}

const TaskAttributes = ({ task }: Props) => {
  return (
    <>
      <p>
        <Template source={templates[StringTemplates.TaskAttributesHeader]} />
      </p>
      <dl>
        <CodeBlock variant="multi-line" language="json" code={JSON.stringify(task?.attributes, null, 2)} />
      </dl>
    </>
  );
};

export default TaskAttributes;
