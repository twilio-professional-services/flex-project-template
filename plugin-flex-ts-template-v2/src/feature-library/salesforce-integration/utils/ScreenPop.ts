import { Manager, ITask } from '@twilio/flex-ui';

import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import { getOpenCti } from './SfdcHelper';
import logger from '../../../utils/logger';
import { setSearchResults } from '../flex-hooks/states';

export const screenPop = (task: ITask) => {
  if (!getOpenCti() || !task) {
    return;
  }

  if (task.attributes.direction === 'outbound') {
    // Skip screen pop for outbound tasks as the user is likely already viewing the desired record
    logger.log(`[salesforce-integration] Skipping screen pop for outbound task ${task.taskSid}`);
    return;
  }

  // Handle single match record ID passed from task attributes - set via Studio flow
  const sfdcObjectId = task.attributes.sfdcObjectId && task.attributes.sfdcObjectId.trim();
  if (sfdcObjectId) {
    logger.log(`[salesforce-integration] Performing screen pop of record ${sfdcObjectId} for task ${task.taskSid}`);
    getOpenCti().screenPop({
      type: getOpenCti().SCREENPOP_TYPE.SOBJECT,
      params: { recordId: sfdcObjectId },
      callback: (result: any) => {
        if (!result.success) {
          logger.error('[salesforce-integration] Failed to screen pop single record match', result);
        }
      },
    });
    return;
  }

  // No single match provided; perform a search and pop based on Salesforce softphone layout settings
  const searchParams =
    task.attributes.name || task.attributes.from || task.attributes.identity || task.attributes.customerAddress;

  logger.log(
    `[salesforce-integration] Performing search and screen pop with params "${searchParams}" for task ${task.taskSid}`,
  );
  getOpenCti().searchAndScreenPop({
    searchParams,
    defaultFieldValues: {
      Phone: searchParams,
    },
    callType: getOpenCti().CALL_TYPE.INBOUND,
    deferred: false, // We could set this true to perform processing or pop conditionally based on the result
    callback: async (result: any) => {
      if (!result.success) {
        logger.error('[salesforce-integration] Failed to search and screen pop', result);
        return;
      }

      const recordIds = Object.keys(result.returnValue);
      if (recordIds.length === 1) {
        // Single match; store on task for activity logging
        try {
          logger.log('[salesforce-integration] Saving single match record ID to task', {
            recordId: recordIds[0],
            taskSid: task.taskSid,
          });
          await TaskRouterService.updateTaskAttributes(task.taskSid, {
            sfdcObjectId: recordIds[0],
            sfdcObjectType: result.returnValue[recordIds[0]].RecordType,
          });
        } catch (error: any) {
          logger.log('[salesforce-integration] Unable to update task', error);
        }
      } else if (recordIds.length > 1) {
        // Multiple match
        const results = Object.values(result.returnValue).map((item: any) => ({
          id: item.Id,
          name: item.Name ?? item.Id,
          type: item.RecordType,
        }));
        Manager.getInstance().store.dispatch(setSearchResults({ reservationSid: task.sid, results }));
        logger.log('[salesforce-integration] Multiple matches', result.returnValue);
      }
    },
  });
};
