// Actions
export const prefix = 'custom/CustomQueueTransferDirectory';
export const UPDATE_QUEUES_LIST = 'UPDATE_QUEUES_LIST';

// State
export interface CustomQueueTransferDirectoryState {
	isFetchingQueueList: boolean,
	queuesList: Array<any>
};
