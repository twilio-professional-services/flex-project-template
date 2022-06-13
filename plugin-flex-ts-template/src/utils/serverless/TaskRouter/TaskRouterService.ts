import ApiService from '../ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface Queue {
  targetWorkers: string,
  friendlyName: string,
  sid: string,
}

interface UpdateTaskAttributesResponse {
	success: boolean;
}

interface GetQueuesResponse {
  success: boolean,
  queues: Array<Queue>
}

let queues = null as null | Array<Queue>;

class TaskRouterService extends ApiService {

	async updateTaskAttributes(taskSid: string, attributesUpdate: object): Promise<Boolean> {

		const result = await this.#updateTaskAttributes(taskSid, JSON.stringify(attributesUpdate))

		return result.success;
	}

	// does a one time fetch for queues per session
	// since queue configuration seldom changes
	async getQueues(force?: boolean): Promise<Array<Queue> | null> {

		if(queues && !force) return queues

		const response = await this.#getQueues();
    if(response.success) queues = response.queues;
		return queues;
	}

	#updateTaskAttributes = (taskSid: string, attributesUpdate: string): Promise<UpdateTaskAttributesResponse> => {

		const encodedParams: EncodedParams = {
			Token: encodeURIComponent(this.manager.user.token),
			taskSid: encodeURIComponent(taskSid),
			attributesUpdate: encodeURIComponent(attributesUpdate)
		};

		return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
			`https://${this.serverlessDomain}/functions/common/flex/taskrouter/update-task-attributes`,
			{
				method: 'post',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: this.buildBody(encodedParams)
			}
		).then((response): UpdateTaskAttributesResponse => {
			return {
				...response,
			};
		});
	};

	#getQueues = (): Promise<GetQueuesResponse> => {

		const encodedParams: EncodedParams = {
			Token: encodeURIComponent(this.manager.user.token)
		};

		return this.fetchJsonWithReject<GetQueuesResponse>(
			`https://${this.serverlessDomain}/functions/common/flex/taskrouter/get-queues`,
			{
				method: 'post',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: this.buildBody(encodedParams)
			}
		).then((response): GetQueuesResponse => {
			return response;
		});
	};


}

export default new TaskRouterService();
