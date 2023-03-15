import client from "../../../../flex-hooks/sdk-clients/sync/SyncClient"

class SyncDocClass {

	constructor() {
	}

	// Getting the Sync Document
	getSyncDoc = (syncDocName) => {
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
	initSyncDocAgentAssistance = (agentWorkerSID, agentFN, conferenceSID, selectedTaskSID, updateStatus) => {
		const docToUpdate = `Agent-Assistance`;

		// Getting the latest Sync Doc agent list and storing in an array
		// We will use this to add/remove the approprate agentAssistance status and agentFN and then update the Sync Doc
		let agentAssistanceArray = [];
		this.getSyncDoc(docToUpdate)
			.then(doc => {
			// Confirm the Sync Doc supervisors array isn't null
			if (doc.data.agentAssistance != null) {
				agentAssistanceArray = [...doc.data.agentAssistance];
			}

			if(updateStatus === 'add') {
				agentAssistanceArray.push(
				{
					'conference': conferenceSID,
					'agentWorkerSID': agentWorkerSID,
					'agentFN': agentFN,
					'selectedTaskSID': selectedTaskSID,
					'needsAssistance': true
				}
				);
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, "agentAssistance", agentAssistanceArray);
				
			// Checking Updated Status we pass during the button click
			// to update the Supervisor's Status within the Supervisor Array to the Sync Doc
			} else if (updateStatus === 'remove') {
				// Get the index of the Supervisor we need to remove in the array
				const removeAgentAssistanceIndex = agentAssistanceArray.findIndex((a) => a.agentWorkerSID === agentWorkerSID);
				// Ensure we get something back, and update the status the supervisor is in
				if (removeAgentAssistanceIndex > -1) {
					agentAssistanceArray.splice(removeAgentAssistanceIndex, 1);
				}
				this.updateSyncDoc(docToUpdate, "agentAssistance", agentAssistanceArray);  
			}
		});
	}

	// This function takes inputs from other parts of the application to add/remove based on the updateStatus
	// we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
	initSyncDocSupervisors = (agentWorkerSID, conferenceSID, supervisorSID, supervisorFN, supervisorStatus, updateStatus) => {
		const docToUpdate = `syncDoc.${agentWorkerSID}`;
		let supervisorsArray = [];
		this.getSyncDoc(docToUpdate)
			.then(doc => {
			// Confirm the Sync Doc supervisors array isn't null
			if (doc.data.supervisors != null) {
				supervisorsArray = [...doc.data.supervisors];
			}
			// Checking Updated Status we pass during the button click
			// to push/add the upervisor from the Supervisor Array within the Sync Doc
			// adding their Full Name and Conference - the Agent will leverage these values
			if(updateStatus === 'add') {
				supervisorsArray.push(
				{
					'conference': conferenceSID,
					'supervisorSID': supervisorSID,
					'supervisor': supervisorFN,
					'status': supervisorStatus
				}
				);
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, "supervisors", supervisorsArray);
				
			// Checking Updated Status we pass during the button click
			// to update the Supervisor's Status within the Supervisor Array to the Sync Doc
			} else if (updateStatus === 'update') {
				// Get the index of the Supervisor we need to remove in the array
				const updateSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				// Ensure we get something back, and update the status the supervisor is in
				if (updateSupervisorIndex > -1) {
					supervisorsArray[updateSupervisorIndex].status = supervisorStatus;	
				}
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, "supervisors", supervisorsArray);
			// Checking Updated Status we pass during button click
			// to splice/remove the Supervisor from the Supervisor Array within the Sync Doc
			} else if (updateStatus === 'remove') {
				// Get the index of the Supervisor we need to remove in the array
				const removeSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				// Ensure we get something back, let's splice this index where the Supervisor is within the array
				if (removeSupervisorIndex > -1) {
				supervisorsArray.splice(removeSupervisorIndex, 1);
				}
				// Update the Sync Doc with the new supervisorsArray
				this.updateSyncDoc(docToUpdate, "supervisors", supervisorsArray);       
			}
		});
	}
	// This is where we update the Sync Document we pass in the syncDocName we are updating
	// We will pass the syncDocName, the type (which would be supervisors or agentAssistance)
	// along with the object
	updateSyncDoc = (syncDocName, type, object) => {
		client
			.document(syncDocName)
			.then(doc => {
				if(type == "supervisors"){
					doc.update({
						supervisors: object
					});
				} if(type == "agentAssistance"){
					doc.update({
						agentAssistance: object
					});
				}
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
	clearSyncDoc = (syncDocName) => {
		client
			.document(syncDocName)
			.then(doc => {
				doc.update({
					supervisors: []
				});
			})
	}
}

export const SyncDoc = new SyncDocClass();
