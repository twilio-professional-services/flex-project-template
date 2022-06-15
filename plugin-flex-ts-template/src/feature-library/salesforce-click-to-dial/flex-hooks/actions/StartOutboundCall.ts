import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.salesforce_click_to_dial;

/* 
   this function servers as a possible solution for salesforce click to dial
   where the provided intregration https://www.twilio.com/docs/flex/admin-guide/integrations/salesforce is used but more data is desired on the call object

   this may be redundent in the future where the provided integration propogates
   the salesforce object data appropriately but in the interim this function 
   can be used to capture the same post event the OOTB solution does but applies
   the extra data to task attributes.  For this to work, the original StartOutboundCall action thats invoked with the OOTB integration needs to be
   suppressed.
*/

export function abortSalesforceClickToDialMissingCaseId(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  flex.Actions.addListener('beforeStartOutboundCall', async (payload, abortFunction) => {
    if (payload.taskAttributes?.origin === 'SFDC' && !payload.taskAttributes?.case_id) {
      console.warn('Cannot perform an outbound call from salesforce without a case_id on the task_attributes...');
      abortFunction();
    }
  });
}
