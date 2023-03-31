export default interface Channel {
  accountSid: string;
  assignedTasks?: number;
  available: boolean;
  availableCapacityPercentage: number;
  capacity: number;
  lastReservedTime?: Date;
  dateCreated: Date;
  dateUpdated: Date;
  sid: string;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  workerSid: string;
  workspaceSid: string;
}
