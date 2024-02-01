import ApiService from '../../../utils/serverless/ApiService';

class EnhancedCRMService extends ApiService {
  serverlessUrl = `${this.serverlessProtocol}://${this.serverlessDomain}`;
}

export default new EnhancedCRMService();
