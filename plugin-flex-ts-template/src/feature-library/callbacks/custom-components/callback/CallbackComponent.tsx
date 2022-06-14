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
}

export type Props = ContainerProps & OwnProps;

export default class CallbackComponent extends React.Component<Props> {
  render() {
    const { callBackData } = this.props.task?.attributes as TaskAttributes
    const timeReceived = moment(callBackData?.utcDateTimeReceived);
    const localTz = moment.tz.guess();
    const localTimeShort = timeReceived.tz(localTz).format('MM-D-YYYY, h:mm:ss a z');
    const serverTimeShort = timeReceived.tz(callBackData?.mainTimeZone || "").format('MM-D-YYYY, h:mm:ss a z');

    return (
        <span className="Twilio">
          <h1>Contact CallBack Request</h1>
          <p>A contact has requested an immediate callback.</p>
          <h4 style={styles.itemBold}>Callback Details</h4>
          <ul>
            <li>
              <div style={styles.itemWrapper}>
                <span style={styles.item}>Contact Phone:</span>
                <span style={styles.itemDetail}>{callBackData?.numberToCall}</span>
              </div>
            </li>
            <li>&nbsp;</li>
            <li>
              <div style={styles.itemWrapper}>
                <span style={styles.itemBold}>Call Reception Information</span>
              </div>
            </li>
            <li>
              <div style={styles.itemWrapper}>
                <label style={styles.item}>Received:&nbsp;</label>
                <Tooltip title="System call reception time" placement="right" >
                  <Icon color="primary" style={styles.info}>
                    info
                  </Icon>
                </Tooltip>
                <label style={styles.itemDetail}>{serverTimeShort}</label>
              </div>
            </li>
            <li>
              <div style={styles.itemWrapper}>
                <label style={styles.item}>Localized:&nbsp;</label>
                <Tooltip title="Call time localized to agent" placement="right">
                  <Icon color="primary" style={styles.info}>
                    info
                  </Icon>
                </Tooltip>
                <label style={styles.itemDetail}>{localTimeShort}</label>
              </div>
            </li>
            <li>&nbsp;</li>
          </ul>
          <Button
            style={styles.cbButton}
            variant="contained"
            color="primary"
            onClick={async () => this.props.startCall(this.props.task)}
          >
            Place Call Now ( {callBackData?.numberToCall} )
          </Button>
        </span>
    );
  }
}
