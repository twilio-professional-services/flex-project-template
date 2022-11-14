import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import FlexHelper from './flexHelper'

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;

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

export const availableActivity = FlexHelper.getActivityByName(SystemActivityNames.available)
// Update 'Activity.onATask' value to match the activity name you're
// using to indicate an agent has an active task
export const onTaskActivity = FlexHelper.getActivityByName(SystemActivityNames.onATask)
// Update 'Activity.onATaskNoAcd' value to match the activity name you're
// using to indicate an agent's tasks are on an outbound task started from
// a non-Available activity
export const onTaskNoAcdActivity = FlexHelper.getActivityByName(SystemActivityNames.onATaskNoAcd)
// Update 'Activity.wrapup' value to match the activity name you're
// using to indicate an agent's tasks are in wrapup status
export const wrapupActivity = FlexHelper.getActivityByName(SystemActivityNames.wrapup)
// Update 'Activity.wrapupNoAcd' value to match the activity name you're
// using to indicate an agent's tasks are in wrapup status when they started
// the first task (outbound cal) from a non-Available activity
export const wrapupNoAcdActivity = FlexHelper.getActivityByName(SystemActivityNames.wrapupNoAcd)

export { SystemActivityNames, systemActivities }
