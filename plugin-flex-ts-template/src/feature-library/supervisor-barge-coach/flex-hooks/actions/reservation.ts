import { Manager } from '@twilio/flex-ui';
import { Actions as BargeCoachStatusAction, } from '../../flex-hooks/states/SupervisorBargeCoach';
import { initialState } from '../../flex-hooks/states/SupervisorBargeCoach';
//FIXME: Fix sync later
//import { SyncDoc } from '../services/Sync'

const manager = Manager.getInstance();

// If coachingStatusPanel is true (enabled), proceed
// otherwise we will not subscribe to the Sync Doc
// You can toggle this at ../states/BargeCoachState
const coachingStatusPanel = initialState.coachingStatusPanel;
if (coachingStatusPanel) {  
    // Listening for agent to hang up the call so we can clear the Sync Doc
    // for the CoachStatePanel feature
    manager.workerClient.on("reservationCreated", (reservation: any) => {

        //Register listener for reservation wrapup event
        reservation.on('wrapup', (reservation: any) => {
                console.log(`Hangup button triggered ${reservation}, clear the Sync Doc`);
                manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
                    enableCoachButton: false,
                    coaching: false,
                    enableBargeinButton: false,
                    muted: true 
                }));
                const agentWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;;
                const agentSyncDoc = `syncDoc.${agentWorkerSID}`;
                // Let's clear the Sync Document and also close/end our subscription to the Document
                //FIXME: Fix Sync later
                // SyncDoc.clearSyncDoc(agentSyncDoc);
                // SyncDoc.closeSyncDoc(agentSyncDoc);
        });    
    });
}