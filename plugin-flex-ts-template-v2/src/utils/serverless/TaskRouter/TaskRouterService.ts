import { TaskAssignmentStatus } from 'types/task-router/Task';
import merge from 'lodash/merge';
import { TaskHelper } from '@twilio/flex-ui';

import ApiService from '../ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface Queue {
  targetWorkers: string;
  friendlyName: string;
  sid: string;
}

interface UpdateTaskAttributesResponse {
  success: boolean;
}

interface GetQueuesResponse {
  success: boolean;
  queues: Array<Queue>;
}

interface GetWorkerChannelsResponse {
  success: boolean;
  workerChannels: Array<WorkerChannelCapacityResponse>;
}

export interface WorkerChannelCapacityResponse {
  accountSid: string;
  assignedTasks: number;
  available: boolean;
  availableCapacityPercentage: number;
  configuredCapacity: number;
  dateCreated: string;
  dateUpdated: string;
  sid: string;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  workerSid: string;
  workspaceSid: string;
  url: string;
}
interface UpdateWorkerChannelResponse {
  success: boolean;
  message?: string;
  workerChannelCapacity: WorkerChannelCapacityResponse;
}

interface UpdateWorkerAttributesResponse {
  success: boolean;
}

let queues = null as null | Array<Queue>;

class TaskRouterService extends ApiService {
  private instanceSid = this.manager.serviceConfiguration.flex_service_instance_sid;

  private STORAGE_KEY = `pending_task_updates_${this.instanceSid}`;

  addToLocalStorage(taskSid: string, attributesUpdate: object): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    storageObject[taskSid] = merge({}, storageObject[taskSid], attributesUpdate);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
  }

  fetchFromLocalStorage(taskSid: string): any {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    return storageObject[taskSid];
  }

  removeFromLocalStorage(taskSid: string): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };
    let changed = false;

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (storageObject[taskSid]) {
      delete storageObject[taskSid];
      changed = true;
    }

    // Janitor - clean up any tasks that we don't have
    for (const [key] of Object.entries(storageObject)) {
      if (!TaskHelper.getTaskByTaskSid(key)) {
        delete storageObject[key];
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
    }
  }

  async updateTaskAttributes(
    taskSid: string,
    attributesUpdate: object,
    deferUpdates: boolean = false,
  ): Promise<boolean> {
    if (deferUpdates) {
      // Defer update; merge new attrs into local storage
      this.addToLocalStorage(taskSid, attributesUpdate);
      return true;
    }

    // Fetch attrs from local storage and merge into the provided attrs
    const mergedAttributesUpdate = merge({}, this.fetchFromLocalStorage(taskSid), attributesUpdate);
    if (Object.keys(mergedAttributesUpdate).length < 1) {
      // No attributes provided to update
      return true;
    }

    const result = await this.#updateTaskAttributes(taskSid, JSON.stringify(mergedAttributesUpdate));

    if (result.success) {
      // we've pushed updates; remove pending attributes
      this.removeFromLocalStorage(taskSid);
    }

    return result.success;
  }

  async updateTaskAssignmentStatus(taskSid: string, assignmentStatus: TaskAssignmentStatus): Promise<boolean> {
    const result = await this.#updateTaskAssignmentStatus(taskSid, assignmentStatus);

    return result.success;
  }

  // does a one time fetch for queues per session
  // since queue configuration seldom changes
  async getQueues(force?: boolean): Promise<Array<Queue> | null> {
    if (queues && !force) return queues;

    const response = await this.#getQueues();
    if (response.success) queues = response.queues;
    return queues;
  }

  async getWorkerChannels(workerSid: string): Promise<Array<WorkerChannelCapacityResponse>> {
    const response = await this.#getWorkerChannels(workerSid);
    if (response.success) return response.workerChannels;
    return [];
  }

  async updateWorkerChannel(
    workerSid: string,
    workerChannelSid: string,
    capacity: number,
    available: boolean,
  ): Promise<boolean> {
    const result = await this.#updateWorkerChannel(workerSid, workerChannelSid, capacity, available);

    return result.success;
  }

  async updateWorkerAttributes(workerSid: string, attributesUpdate: string): Promise<boolean> {
    const result = await this.#updateWorkerAttributes(workerSid, attributesUpdate);
    return result.success;
  }

  #updateTaskAssignmentStatus = async (
    taskSid: string,
    assignmentStatus: TaskAssignmentStatus,
  ): Promise<UpdateTaskAttributesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      assignmentStatus: encodeURIComponent(assignmentStatus),
    };

    return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/update-task-assignment-status`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateTaskAttributesResponse => {
      return {
        ...response,
      };
    });
  };

  #updateTaskAttributes = async (taskSid: string, attributesUpdate: string): Promise<UpdateTaskAttributesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      attributesUpdate: encodeURIComponent(attributesUpdate),
    };

    return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/update-task-attributes`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateTaskAttributesResponse => {
      return {
        ...response,
      };
    });
  };

  #getQueues = async (): Promise<GetQueuesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
    };

    return this.fetchJsonWithReject<GetQueuesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/get-queues`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): GetQueuesResponse => {
      return response;
    });
  };

  #getWorkerChannels = async (workerSid: string): Promise<GetWorkerChannelsResponse> => {
    const encodedParams: EncodedParams = {
      workerSid: encodeURIComponent(workerSid),
      Token: encodeURIComponent(this.manager.user.token),
    };

    return this.fetchJsonWithReject<GetWorkerChannelsResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/get-worker-channels`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): GetWorkerChannelsResponse => {
      return response;
    });
  };

  #updateWorkerChannel = async (
    workerSid: string,
    workerChannelSid: string,
    capacity: number,
    available: boolean,
  ): Promise<UpdateWorkerChannelResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      workerSid: encodeURIComponent(workerSid),
      workerChannelSid: encodeURIComponent(workerChannelSid),
      capacity: encodeURIComponent(capacity),
      available: encodeURIComponent(available),
    };

    return this.fetchJsonWithReject<UpdateWorkerChannelResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/update-worker-channel`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateWorkerChannelResponse => {
      return response;
    });
  };

  #updateWorkerAttributes = async (
    workerSid: string,
    attributesUpdate: string,
  ): Promise<UpdateWorkerAttributesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      workerSid: encodeURIComponent(workerSid),
      attributesUpdate: encodeURIComponent(attributesUpdate),
    };

    return this.fetchJsonWithReject<UpdateWorkerAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/update-worker-attributes`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateWorkerAttributesResponse => {
      return response;
    });
  };
}

export default new TaskRouterService();
