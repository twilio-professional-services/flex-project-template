import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.salesforce_click_to_dial;


const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


/* 
   this function serves as a possible solution for salesforce click to dial
   where the provided intregration https://www.twilio.com/docs/flex/admin-guide/integrations/salesforce is used but more data is desired on the call object

   this may be redundent in the future where the provided integration propogates
   the salesforce object data appropriately but in the interim this function 
   can be used to capture the same post event the OOTB solution does but applies
   the extra data to task attributes.  For this to work, the original StartOutboundCall action thats invoked with the OOTB integration needs to be
   suppressed.
*/
 
export function addSalesforceDataToOutboundCall (flex: typeof Flex, manager: Flex.Manager): void {

  if(!enabled) return;
  
  window.addEventListener('message', async (event) => {

    const { apiType, methodName, response } = event.data;
    if (apiType !== 'opencti' || methodName !== 'onClickToDial' || response.objectType !== 'Case') {
      return;
    }
    /**
     * If the status of an agent is not 'Outbound Ready' when making an outbound
     * call from Salesforce change the status to 'Outbound Ready'
     */
    if (manager.store.getState().flex.worker.activity.name !== 'Available') {
      await Flex.Actions.invokeAction("SetActivity", {
        activityName: "Available",
        options: {
          rejectPendingReservations: false
        }
      });
    }
    await snooze(500);
    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: response.number,
      taskAttributes: {
        case_id: response.recordId,
        phoneNumber: response.number,
        recordId: response.recordId,
        recordName: response.recordName,
        objectType: response.objectType,
        origin: 'SFDC'
      }
    });

  });
}
