import { IWorker, Template, templates } from '@twilio/flex-ui';
import { CodeBlock } from '@twilio-paste/core/code-block';

import { SectionHeader } from './WorkerAttributes.Styles';
import { StringTemplates } from '../../flex-hooks/strings';

interface Props {
  worker?: IWorker;
}

const WorkerAttributes = ({ worker }: Props) => {
  return (
    <>
      <SectionHeader>
        <Template source={templates[StringTemplates.WorkerAttributesHeader]} />
      </SectionHeader>
      <CodeBlock variant="multi-line" language="json" code={JSON.stringify(worker?.attributes, null, 2)} />
    </>
  );
};

export default WorkerAttributes;
