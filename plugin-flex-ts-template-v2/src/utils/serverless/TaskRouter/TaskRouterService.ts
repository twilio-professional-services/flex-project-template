import ApiService from "../ApiService";
import { EncodedParams } from "../../../types/serverless";

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

let queues = null as null | Array<Queue>;

class TaskRouterService extends ApiService {
  async updateTaskAttributes(
    taskSid: string,
    attributesUpdate: object
  ): Promise<Boolean> {
    const result = await this.#updateTaskAttributes(
      taskSid,
      JSON.stringify(attributesUpdate)
    );

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
    available: boolean
  ): Promise<Boolean> {
    const result = await this.#updateWorkerChannel(
      workerSid,
      workerChannelSid,
      capacity,
      available
    );

    return result.success;
  }

  #updateTaskAttributes = (
    taskSid: string,
    attributesUpdate: string
  ): Promise<UpdateTaskAttributesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      attributesUpdate: encodeURIComponent(attributesUpdate),
    };

    return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/update-task-attributes`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): UpdateTaskAttributesResponse => {
      return {
        ...response,
      };
    });
  };

  #getQueues = (): Promise<GetQueuesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
    };

    return this.fetchJsonWithReject<GetQueuesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/get-queues`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): GetQueuesResponse => {
      return response;
    });
  };
  
  #getWorkerChannels = (workerSid: string): Promise<GetWorkerChannelsResponse> => {
    const encodedParams: EncodedParams = {
      workerSid: encodeURIComponent(workerSid),
      Token: encodeURIComponent(this.manager.user.token),
    };
  
    return this.fetchJsonWithReject<GetWorkerChannelsResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/get-worker-channels`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): GetWorkerChannelsResponse => {
      return response;
    });
  };

  #updateWorkerChannel = (
    workerSid: string,
    workerChannelSid: string,
    capacity: number,
    available: boolean
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
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): UpdateWorkerChannelResponse => {
      return response;
    });
  };
}

export default new TaskRouterService();
