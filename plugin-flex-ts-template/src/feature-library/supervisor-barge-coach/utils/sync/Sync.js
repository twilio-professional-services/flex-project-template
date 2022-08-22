import client from "../../../../flex-hooks/sdk-clients/sync/SyncClient"

class SyncDocClass {

	constructor() {
	}

	// Getting the Sync Document
	getSyncDoc(syncDocName) {
		return new Promise(function (resolve) {
			client
				.document(syncDocName)
				.then(doc => {
					resolve(doc)
				})
		})
	}

	// This function takes inputs from other parts of the application to add/remove based on the updateStatus
	// we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
	initSyncDoc(agentWorkerSID, conferenceSID, supervisorSID, supervisorFN, supervisorStatus, updateStatus) {
		const docToUpdate = `syncDoc.${agentWorkerSID}`;

		// Getting the latest Sync Doc agent list and storing in an array
		// We will use this to add/remove the approprate supervisor and then update the Sync Doc
		let supervisorsArray = [];
		this.getSyncDoc(docToUpdate)
			.then(doc => {
			// Confirm the Sync Doc supervisors array isn't null, as of ES6 we can use the spread syntax to clone the array
			if (doc.value.data.supervisors != null) {
				supervisorsArray = [...doc.value.data.supervisors];
			}
			// Checking Updated Status we pass during the button click
			// to push/add the upervisor from the Supervisor Array within the Sync Doc
			// adding their Full Name and Conference - the Agent will leverage these values
			if(updateStatus === 'add') {
				console.log(`Updating Sync Doc: ${docToUpdate} supervisor: ${supervisorFN} has been ADDED to the supervisor array`);
				supervisorsArray.push(
				{
					'conference': conferenceSID,
					'supervisorSID': supervisorSID,
					'supervisor': supervisorFN,
					'status': supervisorStatus
				}
				);
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, supervisorsArray);
				
			// Checking Updated Status we pass during the button click
			// to update the Supervisor's Status within the Supervisor Array to the Sync Doc
			} else if (updateStatus === 'update') {
				console.log(`Updating Sync Doc: ${docToUpdate}, supervisor: ${supervisorFN} has been REMOVED from the supervisor array`);
				// Get the index of the Supervisor we need to remove in the array
				const updateSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				// Ensure we get something back, and update the status the supervisor is in
				if (updateSupervisorIndex > -1) {
					supervisorsArray[updateSupervisorIndex].status = supervisorStatus;	
				}
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, supervisorsArray);
			// Checking Updated Status we pass during button click
			// to splice/remove the Supervisor from the Supervisor Array within the Sync Doc
			} else if (updateStatus === 'remove') {
				console.log(`Updating Sync Doc: ${docToUpdate}, supervisor: ${supervisorFN} has been REMOVED from the supervisor array`);
				// Get the index of the Supervisor we need to remove in the array
				const removeSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				// Ensure we get something back, let's splice this index where the Supervisor is within the array
				if (removeSupervisorIndex > -1) {
				supervisorsArray.splice(removeSupervisorIndex, 1);
				}
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, supervisorsArray);       
			}
			
		});
	}

	// This is where we update the Sync Document we pass in the syncDocName we are updating, the conferenceSID
	// we are monitoring/coaching, the supervisor's Full name, and toggle the coaching status true/false
	// to the supervisor array
	updateSyncDoc(syncDocName, supervisorsObject) {
		client
			.document(syncDocName)
			.then(doc => {
				doc.update({
					data: { 
						supervisors: supervisorsObject
					}
				});
				return new Promise(function (resolve) {
					client
						.document(syncDocName)
						.then(doc => {
							resolve(doc)
						})
				})
			})
	}

	// This will be called when we are tearing down the call to clean up the Sync Doc
	clearSyncDoc(syncDocName) {
		client
			.document(syncDocName)
			.then(doc => {
				doc.update({
					data: { 
						supervisors: []
					}
				});
			})
	}
	// Called when we wish to close/unsubscribe from a specific sync document
	closeSyncDoc(syncDocName) {	
		client
		.document(syncDocName)
		.then(doc => {
			doc.close();
		})
	}
}

export const SyncDoc = new SyncDocClass();
