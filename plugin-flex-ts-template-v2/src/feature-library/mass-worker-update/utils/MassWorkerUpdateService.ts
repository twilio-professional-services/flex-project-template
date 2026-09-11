import * as Flex from '@twilio/flex-ui';

import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import logger from '../../../utils/logger';
import { ExecuteRequest, ExecuteResponse, IdentifyResponse, TargetSelection } from '../types/mass-worker-update';

class MassWorkerUpdateService extends ApiService {
  async identifyWorkers(selection: TargetSelection, limit?: number): Promise<IdentifyResponse | null> {
    try {
      return await this.#identifyWorkers(selection, limit);
    } catch (error: any) {
      logger.error('[mass-worker-update] identifyWorkers failed', error);
      return null;
    }
  }

  async executeUpdate(request: ExecuteRequest, uniqueName: string, batchSize: number): Promise<ExecuteResponse | null> {
    try {
      return await this.#executeUpdate(request, uniqueName, batchSize);
    } catch (error: any) {
      logger.error('[mass-worker-update] executeUpdate failed', error);
      return null;
    }
  }

  async resetState(uniqueName: string): Promise<boolean> {
    try {
      const result = await this.#resetState(uniqueName);
      return result.success;
    } catch (error: any) {
      logger.error('[mass-worker-update] resetState failed', error);
      return false;
    }
  }

  #identifyWorkers = async (selection: TargetSelection, limit?: number): Promise<IdentifyResponse> => {
    const manager = Flex.Manager.getInstance();
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
    };
    if (selection.team) encodedParams.team = encodeURIComponent(selection.team);
    if (selection.department) encodedParams.department = encodeURIComponent(selection.department);
    if (selection.skill) encodedParams.skill = encodeURIComponent(selection.skill);
    if (limit) encodedParams.limit = encodeURIComponent(String(limit));

    return this.fetchJsonWithReject<IdentifyResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/mass-worker-update/flex/identify-workers`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };

  #executeUpdate = async (request: ExecuteRequest, uniqueName: string, batchSize: number): Promise<ExecuteResponse> => {
    const manager = Flex.Manager.getInstance();
    const payload = {
      Token: manager.user.token,
      uniqueName,
      batchSize,
      team: request.team,
      department: request.department,
      skill: request.skill,
      addSkills: JSON.stringify(request.addSkills || []),
      removeSkills: JSON.stringify(request.removeSkills || []),
    };

    return this.fetchJsonWithReject<ExecuteResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/mass-worker-update/flex/execute-update`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
  };

  #resetState = async (uniqueName: string): Promise<{ success: boolean }> => {
    const manager = Flex.Manager.getInstance();
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      uniqueName: encodeURIComponent(uniqueName),
    };

    return this.fetchJsonWithReject<{ success: boolean }>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/mass-worker-update/flex/reset-state`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };
}

export default new MassWorkerUpdateService();
