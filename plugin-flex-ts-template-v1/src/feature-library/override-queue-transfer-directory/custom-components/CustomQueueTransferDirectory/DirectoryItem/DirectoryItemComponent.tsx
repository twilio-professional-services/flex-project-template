import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import {
  ButtonContainer,
  ItemInnerContainer,
  QueueAvatar,
  QueueTitleContainer
} from './DirectoryItemStyles';

interface onTransferClick {
  (item: any, options: any): void;
}

export interface OwnProps {
  task?: Flex.ITask;
  theme?: Flex.Theme;
  item?: any;
  onTransferClick: onTransferClick
}

export type Props = OwnProps;

export default class DirectoryItem extends React.Component<Props> {

  onWarmTransferClick = (event: any) => {
    this.props.onTransferClick(this.props.item, { mode: 'WARM' });
  };

  onColdTransferClick = (event: any) => {
    this.props.onTransferClick(this.props.item, { mode: 'COLD' });
  };

  render() {
    const queue = { name: this.props.item.label };
    return (
      <ItemInnerContainer
        className="Twilio-WorkerDirectory-Queue"
        noGrow
        noShrink
      >
        <QueueAvatar noGrow noShrink className="Twilio-WorkerDirectory-QueueAvatar">
          <Flex.Icon icon="Queue" />
        </QueueAvatar>
        <QueueTitleContainer className="Twilio-WorkerDirectory-QueueContent">
          <Flex.Template source={Flex.templates.WorkerDirectoryQueueItemText} queue={queue} />
        </QueueTitleContainer>
        <ButtonContainer className="Twilio-WorkerDirectory-ButtonContainer">
          <Flex.IconButton
            icon="GroupCall"
            onClick={this.onWarmTransferClick}
            themeOverride={this.props.theme?.WorkerDirectory.ItemActionButton}
            title={Flex.templates.WarmTransferTooltip()}
          />
          { <Flex.IconButton
            icon="Transfer"
            onClick={this.onColdTransferClick}
            themeOverride={this.props.theme?.WorkerDirectory.ItemActionButton}
            title={Flex.templates.ColdTransferTooltip()}
          /> }
        </ButtonContainer>
      </ItemInnerContainer>
    );
  }
}
