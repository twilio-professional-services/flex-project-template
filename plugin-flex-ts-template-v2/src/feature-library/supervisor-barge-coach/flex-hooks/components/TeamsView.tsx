import * as Flex from '@twilio/flex-ui';
import AgentAssistanceTeamsIcon from "../../custom-components/AgentAssistanceTeamsIcon"
import { isAgentAssistanceEnabled } from '../..';

export function addAgentAssistanceTeamsIcon (flex: typeof Flex, manager: Flex.Manager) {

  if(!isAgentAssistanceEnabled()) return;
    flex.WorkersDataTable.Content.add(
    <Flex.ColumnDefinition 
      key="agent-hand-custom" 
      header={""} 
      content={(items: any) => 
        <AgentAssistanceTeamsIcon 
          key={`agent-assistance-icon-${items.worker.sid}`} 
          worker={items.worker.sid}
        />
      }
    />
    , {sortOrder:0}
  );
}

