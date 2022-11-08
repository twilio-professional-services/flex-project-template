import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.multi_call;

export function replaceWorkerDataTableCallsColumnMultiCall(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;
  
  const CallsColumnStyle = Flex.styled('div')`
  .Twilio-TaskCardList {
    flex-wrap: wrap;
  }
  `;
  
  flex.WorkersDataTable.Content.remove('calls');
  flex.WorkersDataTable.Content.add(
    <Flex.ColumnDefinition
      key="multi-call-calls-column"
      header={<Flex.Template code="ColumnHeaderCalls" />}
      style={{
        width: '14rem'
      }}
      content={(item: SupervisorWorkerState, context: Flex.ColumnDataCreationContext) => (
        <CallsColumnStyle>
        <Flex.TaskCardList
          tasks={item.tasks}
          onCardSelected={context.onTaskSelected}
          selectedTaskSid={context.selectedTask && context.selectedTask.sid}
          highlightedTaskSid={context.monitoredTaskSid}
          filter={(task: Flex.ITask) => Flex.TaskHelper.isCallTask(task) && Flex.TaskHelper.isTaskAccepted(task)}
        />
        </CallsColumnStyle>
      )}
    />,
    {
      sortOrder: 1
    }
  );
}
