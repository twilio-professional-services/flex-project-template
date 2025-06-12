import * as Flex from '@twilio/flex-ui';
import { Manager } from '@twilio/flex-ui';

// Define window.appConfig for TypeScript
declare global {
  interface Window {
    appConfig: {
      custom_data?: {
        serverless_functions_protocol: string;
        serverless_functions_domain: string;
        serverless_functions_port: string;
      };
    };
  }
}

// Define Worker interface with attributes
export interface Worker {
  sid: string;
  name: string;
  attributes: {
    [key: string]: any;
    full_name: string;
  };
}

// Define Activity interface
export interface Activity {
  sid: string;
  name: string;
  available: boolean;
}

/**
 * Gets the serverless URL based on environment configuration
 */
export const getServerlessUrl = (): string => {
  const { custom_data } = window.appConfig || {};
  
  if (!custom_data) return '';
  
  const { serverless_functions_protocol, serverless_functions_domain, serverless_functions_port } = custom_data;
  
  if (serverless_functions_domain.includes('twil.io')) {
    return `${serverless_functions_protocol}://${serverless_functions_domain}`;
  }
  
  return `${serverless_functions_protocol}://${serverless_functions_domain}:${serverless_functions_port}`;
};

/**
 * Helper class for Flex-related utilities
 */
export class FlexHelper {
  // Reservation statuses
  static RESERVATION_STATUS = {
    ACCEPTED: 'accepted',
    PENDING: 'pending',
    REJECTED: 'rejected',
    RESCINDED: 'rescinded',
    TIMEOUT: 'timeout',
    CANCELED: 'canceled',
    COMPLETED: 'completed',
    WRAPUP: 'wrapup',
    WRAPPING: 'wrapping',
  };

  /**
   * Get the current worker
   * @returns The current worker object
   */
  static getCurrentWorker() {
    return Manager.getInstance().workerClient;
  }

  /**
   * Get a worker by SID
   * @param workerSid - The SID of the worker to retrieve
   * @returns The worker object
   */
  static async getWorker(workerSid: string): Promise<Worker | undefined> {
    const { insightsClient } = Manager.getInstance();
    if (!insightsClient) return undefined;
    
    try {
      const workerQuery = await insightsClient.liveQuery('tr-worker', `data.worker_sid == "${workerSid}"`);
      const itemsObj = workerQuery.getItems();
      const itemsArr = Object.values(itemsObj);
      return (itemsArr[0] as any)?.value as Worker;
    } catch (error) {
      console.error('Error fetching worker:', error);
      return undefined;
    }
  }

  /**
   * Get the current worker's activity
   * @returns The worker's current activity
   */
  static async getWorkerActivity(): Promise<any> {
    const { workerClient } = Manager.getInstance();
    if (!workerClient) return null;
    
    return workerClient.activity;
  }

  /**
   * Get the current worker's activity name
   * @returns The worker's current activity name
   */
  static async getWorkerActivityName(): Promise<string> {
    const activity = await FlexHelper.getWorkerActivity();
    return activity?.name || '';
  }

  /**
   * Get the selected task's status
   * @returns The status of the selected task
   */
  static getSelectedTaskStatus(): string | null {
    const selectedTaskSid = FlexHelper.getSelectedTaskSid();
    if (!selectedTaskSid) return null;
    
    const task = Flex.TaskHelper.getTaskByTaskSid(selectedTaskSid);
    return task?.status || null;
  }

  /**
   * Get the selected task's SID
   * @returns The SID of the selected task
   */
  static getSelectedTaskSid(): string | undefined {
    const state = Manager.getInstance().store.getState();
    return state.flex?.view?.selectedTaskSid;
  }

  /**
   * Check if a worker has a pending outbound call
   * @returns True if the worker has a pending outbound call
   */
  static async doesWorkerHaveAPendingOutboundCall(): Promise<boolean> {
    const { workerClient } = Manager.getInstance();
    if (!workerClient) return false;
    
    const reservations = workerClient.reservations.values();
    for (const reservation of reservations) {
      if (
        reservation.status === FlexHelper.RESERVATION_STATUS.PENDING &&
        reservation.task.taskChannelUniqueName === 'voice' &&
        reservation.task.attributes.direction === 'outbound'
      ) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get an activity by SID
   * @param activitySid - The SID of the activity to retrieve
   * @returns The activity object
   */
  static async getActivityBySid(activitySid: string): Promise<Activity | undefined> {
    const { insightsClient } = Manager.getInstance();
    if (!insightsClient) return undefined;
    
    try {
      const activityQuery = await insightsClient.liveQuery('tr-activity', `data.activity_sid == "${activitySid}"`);
      const itemsObj = activityQuery.getItems();
      const itemsArr = Object.values(itemsObj);
      return (itemsArr[0] as any)?.value as Activity;
    } catch (error) {
      console.error('Error fetching activity:', error);
      return undefined;
    }
  }

  /**
   * Check if a worker has reservations in a specific state
   * @param status - The reservation status to check for
   * @param workerSid - Optional worker SID (defaults to current worker)
   * @returns True if the worker has reservations in the specified state
   */
  static async doesWorkerHaveReservationsInState(status: string, workerSid?: string): Promise<boolean> {
    const { insightsClient, workerClient } = Manager.getInstance();
    if (!insightsClient) return false;
    
    try {
      const currentWorkerSid = workerSid || workerClient?.sid;
      if (!currentWorkerSid) return false;

      const reservationsQuery = await insightsClient.liveQuery(
        'tr-reservation',
        `data.worker_sid == "${currentWorkerSid}" AND data.status == "${status}"`
      );
      
      const itemsObj = reservationsQuery.getItems();
      const itemsArr = Object.values(itemsObj);
      return itemsArr.length > 0;
    } catch (error) {
      console.error('Error checking reservations:', error);
      return false;
    }
  }

  /**
   * Count outstanding invites for a conversation
   * @param conversation - The conversation state
   * @returns The number of outstanding invites
   */
  static countOfOutstandingInvitesForConversation(conversation: any): number {
    if (!conversation || !conversation.invites) return 0;
    return Object.keys(conversation.invites).length;
  }
}

// Helper function to replace template variables with task attributes and serverless URL
export const replaceTemplateVariables = (template: string, task?: any): string => {
  if (!task) return template;
  
  // Use a single global regex with a replacer function for better performance
  // and to ensure all occurrences are replaced in a single pass
  let result = template.replace(/\{\{task\.([^}]+)\}\}/g, (_full, attributePath) => {
    let value = task;
    attributePath.split('.').forEach((part: string) => {
      value = value && typeof value === 'object' ? value[part] : '';
    });
    return value || '';
  });
  
  // Add serverless URL replacement if needed
  result = result.replace(/\{\{serverless\.url\}\}/g, getServerlessUrl());
  
  return result;
};

// Alias for backward compatibility as recommended by Twilio support
export const replaceStringAttributes = replaceTemplateVariables;

// ConversationsHelper class for backward compatibility as recommended by Twilio support
export class ConversationsHelper {
  static allowLeave(task: any): boolean {
    return task && task.status === 'assigned';
  }
}

// Alternative function implementation
export const allowConversationLeave = (task: any): boolean => {
  return task && task.status === 'assigned';
};
