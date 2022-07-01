import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ContainerProps } from './CoachingStatusPanelContainer'

import { StatusView } from './CoachingStatusPanelStyles';

// Used for the custom redux state
//FIXME: This is old way of reducers need to copy main barge/coach componenet
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { Actions as BargeCoachStatusAction, } from '../states/BargeCoachState';

// Import to get Sync Doc updates
//FIXME: Fix Sync later
//import { SyncDoc } from '../services/Sync';

export interface OwnProps {
  task: Flex.ITask;
}

export type Props = ContainerProps & OwnProps;

export default class CoachingStatusPanel extends React.Component<Props> {

  // Use to validate if we have subscribed to sync updates or not
  #syncSubscribed = false;

  syncUpdates() {

    //FIXME: Remove - this is for testing only
    console.error(`Within Coaching Status Panel syncSubscribed = ${this.#syncSubscribed}`);

    if (this.#syncSubscribed != true) {
      //FIXME: Need to fix Sync service with new way
      //FIXME: Fix redux call
      // const myWorkerSID = this.props.myWorkerSID;
      // let supervisorArray = this.props.supervisorArray;   
      // // Let's subscribe to the sync doc as an agent/work and check
      // // if we are being coached, if we are, render that in the UI
      // // otherwise leave it blank
      // const mySyncDoc = `syncDoc.${myWorkerSID}`;
      // SyncDoc.getSyncDoc(mySyncDoc)
      // .then((doc: { on: (arg0: string, arg1: (updatedDoc: any) => void) => void; value: { data: { supervisors: null; }; }; }) => {
      //   // We are subscribing to Sync Doc updates here and logging anytime that happens
      //   doc.on("updated", (updatedDoc: any) => {
      //     if (doc.value.data.supervisors != null) {
      //       supervisorArray = [...doc.value.data.supervisors];
      //     } else {
      //       supervisorArray = [];
      //     }
  
      //     // Set Supervisor's name that is coaching into props
      //     this.props.setBargeCoachStatus({ 
      //       supervisorArray: supervisorArray
      //     });
      //   })
      // });
      // this.#syncSubscribed = true;
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