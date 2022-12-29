import * as Flex from '@twilio/flex-ui';
import { ScheduleManagerConfig, UpdateConfigResponse, UpdateConfigStatusResponse, PublishConfigRequest, PublishConfigResponse } from '../types/schedule-manager';
import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { getServerlessDomain } from '..';

class ScheduleManagerService extends ApiService {
  readonly scheduleManagerServerlessDomain: string;
  
  constructor() {
    super();
    
    this.scheduleManagerServerlessDomain = getServerlessDomain();
    
    if (!this.scheduleManagerServerlessDomain) {
      console.error(
        "schedule_manager serverless_domain is not set in flex config"
      );
    }
  }

  async list(): Promise<ScheduleManagerConfig | null> {
    try {
      const config = await this.#list();
      return config;
    } catch (error) {
      console.log('Unable to list config', error);
      return null;
    }
  }
  
  async update(config: ScheduleManagerConfig): Promise<UpdateConfigResponse> {
    try {
      const response = await this.#update(config);
      return response;
    } catch (error) {
      console.log('Unable to update config', error);
      
      // TODO: Modify request util to return status too.
      if (error == 'Provided version SID is not the latest deployed asset version SID')
      {
        return {
          success: false,
          buildSid: 'versionError'
        };
      }
      
      return {
        success: false,
        buildSid: 'error'
      };
    }
  }
  
  async updateStatus(buildSid: string): Promise<UpdateConfigStatusResponse> {
    try {
      const response = await this.#updateStatus({buildSid});
      return response;
    } catch (error) {
      console.log('Unable to get config build status', error);
      return {
        success: false,
        buildStatus: 'error'
      };
    }
  }
  
  async publish(buildSid: string): Promise<PublishConfigResponse> {
    try {
      const response = await this.#publish({buildSid});
      return response;
    } catch (error) {
      console.log('Unable to publish config', error);
      return {
        success: false,
        deploymentSid: 'error'
      };
    }
  }

  #list = async () : Promise<ScheduleManagerConfig> => {
    const manager = Flex.Manager.getInstance();
    
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
    };
    
    const response = await this.fetchJsonWithReject<ScheduleManagerConfig>(
      `https://${this.scheduleManagerServerlessDomain}/admin/list`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams)
      }
    );
    
    return {
        ...response,
    };
  };
  
  #update = async (config: ScheduleManagerConfig) : Promise<UpdateConfigResponse> => {
    const manager = Flex.Manager.getInstance();
    
    const params = {
      ...config,
      Token: manager.user.token,
    };
    
    const response = await this.fetchJsonWithReject<UpdateConfigResponse>(
      `https://${this.scheduleManagerServerlessDomain}/admin/update`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      }
    );
    
    return {
      ...response,
    };
  };
  
  #updateStatus = async (request: PublishConfigRequest) : Promise<UpdateConfigStatusResponse> => {
    const manager = Flex.Manager.getInstance();
    
    const encodedParams: EncodedParams = {
      buildSid: encodeURIComponent(request.buildSid),
      Token: encodeURIComponent(manager.user.token),
    };
    
    const response = await this.fetchJsonWithReject<UpdateConfigStatusResponse>(
      `https://${this.scheduleManagerServerlessDomain}/admin/update-status`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams)
      }
    );
    
    return response;
  };
  
  #publish = async (request: PublishConfigRequest) : Promise<PublishConfigResponse> => {
    const manager = Flex.Manager.getInstance();
    
    const encodedParams: EncodedParams = {
      buildSid: encodeURIComponent(request.buildSid),
      Token: encodeURIComponent(manager.user.token),
    };
    
    const response = await this.fetchJsonWithReject<PublishConfigResponse>(
      `https://${this.scheduleManagerServerlessDomain}/admin/publish`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams)
      }
    );
    
    return response;
  };
}

export default new ScheduleManagerService();
