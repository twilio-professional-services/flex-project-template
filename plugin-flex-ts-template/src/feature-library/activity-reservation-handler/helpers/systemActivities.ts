import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;

const {
  available = "Available",
  onATask = "On a Task",
  onATaskNoAcd = "On a Task, No ACD",
  wrapup = "Wrap Up",
  wrapupNoAcd = "Wrap Up, No ACD",
} = custom_data.features.activity_reservation_handler?.system_activity_names || {};


const SystemActivityNames = {
  available : available as string,
  onATask : onATask as string,
  onATaskNoAcd: onATaskNoAcd as string,
  wrapup: wrapup as string,
  wrapupNoAcd: wrapupNoAcd as string
};

// The activities in this array can only be set programmatically and will
// not be stored as pending activities to switch the user back to
const systemActivities: string[] = [
  SystemActivityNames.onATask,
  SystemActivityNames.onATaskNoAcd,
  SystemActivityNames.wrapup,
  SystemActivityNames.wrapupNoAcd];

console.log("systemActivities", systemActivities)
export { SystemActivityNames, systemActivities }