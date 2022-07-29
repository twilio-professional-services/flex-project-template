import * as Flex from '@twilio/flex-ui';
import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

import styles from './CallbackStyles';
import { TaskAttributes } from 'types/task-router/Task';
import { ContainerProps } from './CallbackContainer'

export interface OwnProps {
  task: Flex.ITask;
  allowRequeue: boolean;
  maxAttempts: number;
}

export type Props = ContainerProps & OwnProps;

export default class CallbackComponent extends React.Component<Props> {
  render() {
    const taskStatus = this.props.task?.taskStatus
    const { taskType, callBackData } = this.props.task?.attributes as TaskAttributes
    const timeReceived = moment(callBackData?.utcDateTimeReceived);
    const localTz = moment.tz.guess();
    const localTimeShort = timeReceived.tz(localTz).format('MM-D-YYYY, h:mm:ss a z');
    const serverTimeShort = 'System time: ' + timeReceived.tz(callBackData?.mainTimeZone || localTz).format('MM-D-YYYY, h:mm:ss a z');
    const disableButtons = taskStatus !== 'assigned' || this.props.isCompletingCallbackAction[this.props.task.taskSid] || this.props.isRequeueingCallbackAction[this.props.task.taskSid];
    const thisAttempt = callBackData?.attempts ? (Number(callBackData.attempts) + 1) : 1

    return (
        <span className="Twilio">
          {
            taskType == 'callback' &&
            <><h1>Contact Callback Request</h1>
            <p>A contact has requested an immediate callback.</p></>
          }
          {
            taskType == 'voicemail' &&
            <><h1>Contact Voicemail</h1>
            <p>A contact has left a voicemail that requires attention.</p></>
          }
          {
            callBackData.recordingUrl && !callBackData.isDeleted &&
            <><h2>Voicemail recording</h2>
            <p><audio style={styles.audioPlayer} ref="audio_tag" src={callBackData.recordingUrl} controls /></p></>
          }
          {
            callBackData.transcriptText && !callBackData.isDeleted &&
            <><h2>Voicemail transcript</h2>
            <p>{callBackData.transcriptText}</p></>
          }
          <h2>Contact phone</h2>
          <p>{callBackData?.numberToCall}</p>
          <h2>Call reception time</h2>
          <p>{localTimeShort}
            <Tooltip title={serverTimeShort} placement="right" >
              <Icon color="primary" style={styles.info}>
                info
              </Icon>
            </Tooltip></p>
          {
            this.props.allowRequeue &&
            <><h2>Callback attempt</h2>
            <p>{thisAttempt} of {this.props.maxAttempts}</p></>
          }
          <p></p>
          <Button
            disabled={disableButtons}
            style={styles.cbButton}
            variant="contained"
            color="primary"
            onClick={async () => this.props.startCall(this.props.task)}
          >
            Place Call Now To {callBackData?.numberToCall}
          </Button>
          {
            this.props.allowRequeue && thisAttempt < this.props.maxAttempts &&
            <Button
              disabled={disableButtons}
              style={styles.cbButton}
              variant="contained"
              onClick={async () => this.props.requeueCallback(this.props.task)}
            >
              Retry Later
            </Button>
          }
        </span>
    );
  }
}
