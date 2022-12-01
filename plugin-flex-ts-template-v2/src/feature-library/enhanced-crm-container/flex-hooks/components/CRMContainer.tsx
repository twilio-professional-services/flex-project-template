import * as Flex from '@twilio/flex-ui';

import IFrameCRMContainer from '../../custom-components/IFrameCRMContainer'

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled } = getFeatureFlags().features?.enhanced_crm_container || {};

export function replaceAndSetCustomCRMContainer(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  const baseUrl = 'https://www.bing.com';
  Flex.CRMContainer.Content.replace(<IFrameCRMContainer key="custom-crm-container" baseUrl={baseUrl} />, {
    sortOrder: 1,
  })
}
