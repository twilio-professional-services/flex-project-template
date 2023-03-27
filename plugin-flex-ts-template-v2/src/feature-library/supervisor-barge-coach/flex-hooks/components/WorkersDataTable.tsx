import * as Flex from '@twilio/flex-ui';

import AgentAssistanceTeamsIcon from '../../custom-components/AgentAssistanceTeamsIcon';
import { isAgentAssistanceEnabled } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.WorkersDataTable;
export const componentHook = function addAgentAssistanceTeamsIcon(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isAgentAssistanceEnabled()) return;
  flex.WorkersDataTable.Content.add(
    <Flex.ColumnDefinition
      key="agent-hand-custom"
      header={''}
      style={{ width: '50px' }}
      content={(items: any) => (
        <AgentAssistanceTeamsIcon key={`agent-assistance-icon-${items.worker.sid}`} worker={items.worker.sid} />
      )}
    />,
    {
      sortOrder: 0,
      align: 'start',
    },
  );
};
