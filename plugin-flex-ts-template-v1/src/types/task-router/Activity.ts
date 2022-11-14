export default interface Activity {
  accountSid: string;
  available: boolean;
  dateCreated: Date;
  dateUpdated: Date;
  isCurrent: boolean;
  name: string;
  sid: string;
  workspaceSid: string;
}