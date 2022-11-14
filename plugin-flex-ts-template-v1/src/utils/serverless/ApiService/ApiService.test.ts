import * as Flex from '@twilio/flex-ui';
import ApiService from './';
import { EncodedParams } from '../../../types/serverless';
import { UIAttributes } from '../../../types/manager/ServiceConfiguration';

// NOTE: Make dummy class to extend ApiService because it's abstract
class Test extends ApiService {
  // NOTE: Make helper function to provide access to protected class members
  testHasManagerClassMember(): boolean {
    return this.manager !== undefined;
  }

  // NOTE: Make helper function to provide access to protected class members
  testBuildBody(encodedParams: EncodedParams): string {
    return this.buildBody(encodedParams);
  }
}

describe('utils/common/ApiService', () => {
  const TestService = new Test();

  it('should provide access to the Flex Manager instance', () => {
    expect(TestService.testHasManagerClassMember()).toBe(true);
  });

  it('should provide access to the configured serverless domain', () => {
    const { serviceConfiguration: { ui_attributes } } = Flex.Manager.getInstance();
    const { serverless_functions_domain } = ui_attributes as UIAttributes;
    expect(TestService.serverlessDomain).toBe(serverless_functions_domain);
  });

  it('should build encoded params into a string to use as the body for serverless reqeusts', () => {
    const encodedParams: EncodedParams = {
      testParam1: encodeURIComponent('testParam1ToBeEncoded'),
      testParam2: encodeURIComponent('testParam2ToBeEncoded'),
      testParamToDrop: undefined
    };

    const body = TestService.testBuildBody(encodedParams);

    expect(body).toBe('testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded');
  });
});