import * as Flex from '@twilio/flex-ui';

type FlexUIAttributes = Flex.ServiceConfiguration["ui_attributes"];

export interface UIAttributes extends FlexUIAttributes {

  custom_data: {
    serverless_functions_domain: string;
    features: {
      callbacks : {
        enabled : boolean
      }
      caller_id: {
        enabled: boolean
      },
      chat_transfer: {
        enabled: boolean
      },
      enhanced_crm_container: {
        enabled: boolean
      },
      override_queue_transfer_directory: {
        enabled: boolean
      },
      salesforce_click_to_dial: {
        enabled: boolean
      },
      scrollable_activities: {
        enabled: boolean
      }
    }
  }
}
