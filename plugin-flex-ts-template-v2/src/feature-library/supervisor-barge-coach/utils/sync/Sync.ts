import client from '../../../../utils/sdk-clients/sync/SyncClient';

class SyncDocClass {
  // Getting the Sync Document
  getSyncDoc = (syncDocName: string): any => {
    return new Promise((resolve) => {
      client
        .document(syncDocName)
        .then((doc: any) => {
          resolve(doc);
        })
        .catch((error: any) => {
          console.error('Sync Util: getSyncDoc: Error calling this function', error);
        });
    });
  };

  // This function takes inputs from other parts of the application to add/remove based on the updateStatus
  // we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
  initSyncDocAgentAssistance = (
    agentWorkerSID: string,
    agentFN: string,
    conferenceSID: string,
    selectedTaskSID: string,
    updateStatus: string,
  ) => {
    const docToUpdate = `Agent-Assistance`;
    let agentAssistanceArray: Array<any> = [];
    this.getSyncDoc(docToUpdate)
      .then((doc: any) => {
        if (doc?.data?.agentAssistance) {
          agentAssistanceArray = [...doc.data.agentAssistance];
        }
        if (updateStatus === 'add') {
          agentAssistanceArray.push({
            conference: conferenceSID,
            agentWorkerSID,
            agentFN,
            selectedTaskSID,
            needsAssistance: true,
          });
          this.updateSyncDoc(docToUpdate, agentAssistanceArray);
        } else if (updateStatus === 'remove') {
          const removeAgentAssistanceIndex = agentAssistanceArray?.findIndex(
            (a: any) => a.agentWorkerSID === agentWorkerSID,
          );
          if (removeAgentAssistanceIndex > -1) {
            agentAssistanceArray.splice(removeAgentAssistanceIndex, 1);
          }
          this.updateSyncDoc(docToUpdate, agentAssistanceArray);
        }
      })
      .catch((error: any) => {
        console.error('Sync Util: initSyncDocAgentAssistance: Error calling this function', error);
      });
  };

  // This function takes inputs from other parts of the application to add/remove based on the updateStatus
  // we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
  initSyncDocSupervisors = (
    agentWorkerSID: string,
    conferenceSID: string,
    supervisorSID: string,
    supervisorFN: string,
    supervisorStatus: string,
    updateStatus: string,
  ) => {
    const docToUpdate = `syncDoc.${agentWorkerSID}`;
    let supervisorsArray: Array<any> = [];
    this.getSyncDoc(docToUpdate)
      .then((doc: any) => {
        if (doc.data.supervisors) {
          supervisorsArray = [...doc.data.supervisors];
        }
        if (updateStatus === 'add') {
          supervisorsArray.push({
            conference: conferenceSID,
            supervisorSID,
            supervisor: supervisorFN,
            status: supervisorStatus,
          });
          this.updateSyncDoc(docToUpdate, supervisorsArray);
        } else if (updateStatus === 'update') {
          const updateSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
          if (updateSupervisorIndex > -1) {
            supervisorsArray[updateSupervisorIndex].status = supervisorStatus;
          }
          this.updateSyncDoc(docToUpdate, supervisorsArray);
        } else if (updateStatus === 'remove') {
          const removeSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
          if (removeSupervisorIndex > -1) {
            supervisorsArray.splice(removeSupervisorIndex, 1);
          }
          this.updateSyncDoc(docToUpdate, supervisorsArray);
        }
      })
      .catch((error: any) => {
        console.error('Sync Util: initSyncDocSupervisors: Error calling this function', error);
      });
  };

  // This is where we update the Sync Document we pass in the syncDocName we are updating
  // We will pass the syncDocName along with the object
  updateSyncDoc = (syncDocName: string, object: Array<any>) => {
    client
      .document(syncDocName)
      .then(async (doc: any) => {
        if (syncDocName === 'Agent-Assistance') {
          doc.update({
            agentAssistance: object,
          });
        } else {
          doc.update({
            supervisors: object,
          });
        }
        return new Promise((resolve) => {
          client.document(syncDocName).then((doc: unknown) => {
            resolve(doc);
          });
        });
      })
      .catch((error: any) => {
        console.error('Sync Util: updateSyncDoc: Error calling this function', error);
      });
  };

  // This will be called when we are tearing down the call to clean up the Sync Doc
  clearSyncDoc = (syncDocName: string) => {
    client
      .document(syncDocName)
      .then((doc: any) => {
        doc.update({
          supervisors: [],
        });
      })
      .catch((error: any) => {
        console.error('Sync Util: clearSyncDoc: Error calling this function', error);
      });
  };
}

export const SyncDoc = new SyncDocClass();
