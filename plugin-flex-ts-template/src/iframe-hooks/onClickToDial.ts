import * as Flex from '@twilio/flex-ui';

const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default (flex: typeof Flex, manager: Flex.Manager) => {

  window.addEventListener('message', async (event) => {

    const { apiType, methodName, response } = event.data;
    if (apiType !== 'opencti' || methodName !== 'onClickToDial' || response.objectType !== 'Case') {
      return;
    }
    /**
     * If the status of an agent is not 'Outbound Ready' when making an outbound
     * call from Salesforce change the status to 'Outbound Ready'
     */
    if (manager.store.getState().flex.worker.activity.name !== 'Outbound Ready') {
      await Flex.Actions.invokeAction("SetActivity", {
        activityName: "Outbound Ready",
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
