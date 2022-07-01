import * as Flex from '@twilio/flex-ui';

type FlexUIAttributes = Flex.ServiceConfiguration["ui_attributes"];

// feature: activity-skill-filter
export type ActivitySkillFilterRule = {
  required_skill: string,
  sort_order: number
}

export type ActivitySkillFilterRules = {
  [key: string]: ActivitySkillFilterRule
}

export interface UIAttributes extends FlexUIAttributes {

  custom_data: {
    serverless_functions_domain: string;
    features: {
      activity_skill_filter: {
        enabled: boolean,
        filter_teams_view: boolean,
        rules: ActivitySkillFilterRules
      },
      callbacks: {
        enabled: boolean
      },
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
      },
      supervisor_barge_coach: {
        enabled: boolean
      }
    }
  }
}
