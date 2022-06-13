import * as React from 'react';
import DirectoryItem from './DirectoryItem';
import {
  TabContainer,
  ItemContainer,
  InputContainer,
  StyledInput,
} from './CustomQueueTransferDirectoryStyles';
import { ContainerProps } from './CustomQueueTransferDirectoryContainer'
import * as Flex from '@twilio/flex-ui'


export interface onTransferClick {
  (queue: any, options: any): void;
}

export interface invokeTransfer {
  (payload: any): void;
}

export interface OwnProps {
  invokeTransfer: invokeTransfer;
  queuesList: any;
  queueNameEnforcedFilter: string;
  task?: Flex.ITask;
  manager: Flex.Manager
}

export type Props = OwnProps & ContainerProps;


export default class CustomQueueTransferDirectory extends React.Component<Props> {

  private queueSearchInputElementRef = React.createRef<HTMLInputElement>();

  private queueSearchTimer: number | null | undefined;

  onTransferClick(queue: any, options: any) {
    Flex.Actions.invokeAction('TransferTask', {
      task: this.props.task,
      targetSid: queue.value,
      options: options,
    });
    Flex.Actions.invokeAction('HideDirectory');
  }

  async loadQueueList(searchQuery: string) {

    const { manager, updateAvailableQueues, queueNameEnforcedFilter } = this.props;

    // Query for list of queues
    const queues = await (await manager.insightsClient.map({
      id: 'realtime_statistics_v1',
      mode: 'open_existing',
    })).getItems()

    // Apply filters
    const list = queues.items
      .map((queue: any) => {
        const {
          sid,
          friendly_name,
          total_eligible_workers: eligibleWorkers,
          total_available_workers: availableWorkers,
        } = queue.value;

        return availableWorkers > 0 && friendly_name.includes(queueNameEnforcedFilter) && friendly_name.includes(searchQuery)
          ? { label: friendly_name, value: sid }
          : null;
      })
      // removes nulls
      .filter((elem) => elem)
      // sort alphabetically
      .sort((a: any, b: any) => (a.label > b.label) ? 1 : -1);

    const queuesList = [] && list;

    updateAvailableQueues(queuesList);
  }

  componentDidMount() {
    this.loadQueueList("");
  }

  onQueueSearchInputChange = () => {
    if (this.queueSearchTimer) {
      return;
    }
    this.queueSearchTimer = window.setTimeout(() => {
      if (this.queueSearchInputElementRef.current != null) {
        const node = this.queueSearchInputElementRef.current!;
        this.loadQueueList(node?.value);
        this.queueSearchTimer = null;
      }
    }, 300);
  };

  render() {
    return (
      <TabContainer key="custom-directory-container">
        <ItemContainer
          key="custom-directory-item-container"
          className="Twilio-WorkerDirectory-Queues"
          vertical
        >
          <InputContainer key="queues-input-container">
            <StyledInput
              key="queues-input-field"
              inputRef={this.queueSearchInputElementRef}
              onChange={this.onQueueSearchInputChange}
              placeholder={Flex.templates.WorkerDirectorySearchPlaceholder()}
            />
          </InputContainer>
          {this.props.queuesList.map((item: any) => {
            return (
              <DirectoryItem
                item={item}
                key={item.label}
                onTransferClick={this.onTransferClick.bind(this)}
              />
            );
          })}
        </ItemContainer>
      </TabContainer>
    );
  }
}