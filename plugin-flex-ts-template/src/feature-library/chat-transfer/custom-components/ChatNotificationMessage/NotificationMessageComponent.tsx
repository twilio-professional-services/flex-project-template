import React from 'react';
import { TextDiv } from './NotificationMessageStyles'

export interface OwnProps {
  message?: any;
}

export type Props = OwnProps;

export default class NotificationMessage extends React.PureComponent<Props> {

  render() {
    const { index } = this.props.message
    const TextDivKey = `Text-Container-${index}`
    return (
      <TextDiv key={TextDivKey}>
        <span>{this.props.message.source.body}</span>
      </TextDiv>
    );
  }
}
