import React, { Component } from 'react';
import styled from 'react-emotion';
import * as Flex from '@twilio/flex-ui';
import RefreshIcon from '@material-ui/icons/Refresh';

import { ContainerProps } from '../IFrameCRMContainer'
import { wrapperStyle, frameStyle } from './IFrameWrapperStyles'

const IFrameRefreshButtonStyledDiv = styled('div')`
  align-items: center;
  background-color: #5469D4;
  border-radius: 50%;
  bottom: 10px;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 10px;
  cursor: pointer;
  display: flex;
  height: 50px;
  justify-content: center;
  position: fixed;
  right: 10px;
  width: 50px;
  z-index: 9999;
`;

export interface OwnProps {
  thisTask: Flex.ITask, // task assigned to iframe
  task: Flex.ITask // task in Context
  baseUrl: string
}

export type Props = ContainerProps & OwnProps;

export default class IFrameWrapper extends Component<Props> {
  state: {
    iFrameKey: number;
  };

  private iFrameRef: React.RefObject<HTMLIFrameElement>;

  constructor(props: Props) {
    super(props);

    /**
     * Setup ref for this iframe which we can use like this:
     * this.iframeRef.current.contentWindow.postMessage('A test message...', '*')
     */
    this.iFrameRef = React.createRef();

    this.state = {
      iFrameKey: 0,
    }
  }

  handleOnClick = (event: any) => {
    this.setState({
      iFrameKey: Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1)),
    })
  }

  render() {
    let { task, thisTask, baseUrl } = this.props;

    // This allows short-lived tasks (e.g. callback tasks) to share/show
    // the same iframe as their parent task so CRM work can continue after
    // the short-lived task completes and disappears
    const visibility = (
      task?.taskSid === thisTask.taskSid ||
      task?.attributes?.parentTask === thisTask.sid
    ) ? 'visible' : 'hidden' as any;

    const url = thisTask?.attributes?.case_id
      ? `${baseUrl}?ticket_id=${thisTask.attributes.case_id}&iframe=true`
      : `${baseUrl}?iframe=true`;

    return (
      <div style={{ ...wrapperStyle, visibility }}>
        <IFrameRefreshButtonStyledDiv
          onClick={this.handleOnClick}
        >
          <RefreshIcon nativeColor="white" />
        </IFrameRefreshButtonStyledDiv>
        <iframe
          key={this.state.iFrameKey}
          style={frameStyle}
          src={url}
          ref={this.iFrameRef}
        />
      </div>
    );
  }
}
