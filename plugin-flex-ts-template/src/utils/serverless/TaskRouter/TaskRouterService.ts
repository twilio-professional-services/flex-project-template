import ApiService from '../ApiService';
import { EncodedParams } from '../../../types/serverless';

interface UpdateTaskAttributesResponse {
	success: boolean;
}

let queues = null as null | Array<any>;

class TaskRouterService extends ApiService {

	async updateTaskAttributes(taskSid: string, attributesUpdate: object): Promise<Boolean> {

		const result = await this.#updateTaskAttributes(taskSid, JSON.stringify(attributesUpdate))

		return result.success;
	}

	// does a one time fetch for queues per session
	// since queue configuration seldom changes
	async getQueues(): Promise<Array<any>> {

		if(queues) return queues

		queues = await this.#getQueues();
		return queues;
	}

	#updateTaskAttributes = (taskSid: string, attributesUpdate: string): Promise<UpdateTaskAttributesResponse> => {

		const encodedParams: EncodedParams = {
			Token: encodeURIComponent(this.manager.user.token),
			taskSid: encodeURIComponent(taskSid),
			attributesUpdate: encodeURIComponent(attributesUpdate)
		};

		return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
			`https://${this.serverlessDomain}/functions/flex/task/update-attributes`,
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

	#getQueues = (): Promise<Array<any>> => {

		const encodedParams: EncodedParams = {
			Token: encodeURIComponent(this.manager.user.token)
		};

		return this.fetchJsonWithReject<any>(
			`https://${this.serverlessDomain}/functions/flex/queues/list-queues`,
			{
				method: 'post',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: this.buildBody(encodedParams)
			}
		).then((response): any => {
			const { queues } = response;
			return queues;
		});
	};


}

export default new TaskRouterService();
