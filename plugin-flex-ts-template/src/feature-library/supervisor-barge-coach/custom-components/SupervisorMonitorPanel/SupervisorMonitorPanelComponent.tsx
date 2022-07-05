import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ContainerProps } from './SupervisorMonitorPanelContainer'

import { StatusView } from './SupervisorMonitorPanelStyles';

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

export interface OwnProps {
  task: Flex.ITask;
}

export type Props = ContainerProps & OwnProps;

export default class  SupervisorMonitorPanel extends React.Component<Props> {

  // Use to validate if we have subscribed to sync updates or not
  #syncSubscribed = false;

  supervisorArray() {
    
    return (
      this.props.supervisorArray.map(supervisorArray => (
        <tr key={supervisorArray.supervisor}>
          <td>{supervisorArray.supervisor}</td>
          <td style={{ "color": 'green' }}>&nbsp;{supervisorArray.status}</td>
        </tr>
      ))
    )
 }

 syncUpdates() {

    if (this.#syncSubscribed != true) {
      this.#syncSubscribed = true;

      // If the supervisor array has value in it, that means someone is coaching
      // We will map each of the supervisors that may be actively coaching
      // Otherwise we will not display anything if no one is actively coaching
      const agentWorkerSID = this.props.agentWorkerSID;
      let supervisorArray = this.props.supervisorArray;   
      // Let's subscribe to the sync doc as an agent/work and check
      // if we are being coached, if we are, render that in the UI
      // otherwise leave it blank
      const mySyncDoc = `syncDoc.${agentWorkerSID}`;
      SyncDoc.getSyncDoc(mySyncDoc)
      .then(doc => {
        // We are subscribing to Sync Doc updates here and logging anytime that happens
        doc.on("updated", (updatedDoc: any) => {
          if (doc.value.data.supervisors != null) {
            supervisorArray = [...doc.value.data.supervisors];
            console.log(updatedDoc);
          } else {
            supervisorArray = [];
          }

          // Set Supervisor's name that is coaching into props
          this.props.setBargeCoachStatus({ 
            supervisorArray: supervisorArray
          });
        })
      });
    }
    
   return;
 }

  render() {

    this.syncUpdates();

    if (this.props.supervisorArray.length != 0) {
      return (
        <StatusView>
          <div>
            <h1 id='title'>Active Supervisors:</h1>
            <table id='supervisors'>
               <tbody>
                  {this.supervisorArray()}
               </tbody>
            </table>
          </div>
        </StatusView>
      );
    } else {
      return (
        <StatusView>
          <div>
            <h1 id='title'>Active Supervisors:</h1>
            None
          </div>
        </StatusView>
      );
    }
  }
}