import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ContainerProps } from './CoachingStatusPanelContainer'

import { StatusView } from './CoachingStatusPanelStyles';

// Import to get Sync Doc updates
import { SyncDoc } from '../../utils/sync/Sync'

export interface OwnProps {
  task: Flex.ITask;
}

export type Props = ContainerProps & OwnProps;

export default class CoachingStatusPanel extends React.Component<Props> {

  // Use to validate if we have subscribed to sync updates or not
  #syncSubscribed = false;

  syncUpdates() {

    if (this.#syncSubscribed != true) {
      
      const myWorkerSID = this.props.myWorkerSID;
      let supervisorArray = this.props.supervisorArray;   
      // Let's subscribe to the sync doc as an agent/work and check
      // if we are being coached, if we are, render that in the UI
      // otherwise leave it blank
      const mySyncDoc = `syncDoc.${myWorkerSID}`;
      SyncDoc.getSyncDoc(mySyncDoc)
      .then(doc => {
        // We are subscribing to Sync Doc updates here and logging anytime that happens
        doc.on("updated", (updatedDoc: string) => {
          if (doc.value.data.supervisors != null) {
            supervisorArray = [...doc.value.data.supervisors];
          } else {
            supervisorArray = [];
          }
  
          // Set Supervisor's name that is coaching into props
          this.props.setBargeCoachStatus({ 
            supervisorArray: supervisorArray
          });
        })
      });
      this.#syncSubscribed = true;
    }

    return;
  }
  render() {
    
    const { supervisorArray }: any = this.props;
    this.syncUpdates();

    // If the supervisor array has value in it, that means someone is coaching
    // We will map each of the supervisors that may be actively coaching
    // Otherwise we will not display anything if no one is actively coaching
    if (supervisorArray.length != 0) {

      return (
        <StatusView>
          <div>You are being Coached by: 
            <h1 style={{ "color": 'green' }}>
              <ol>
                {supervisorArray.map((supervisorArray: { supervisor: {} }) => (
                  <li key={`${Math.random()}`}>{supervisorArray.supervisor}</li>
                ))}
              </ol>
            </h1>
          </div>
        </StatusView>
      );
    } else {
      return (
        <StatusView>
        </StatusView>
      );
    }
  }
}