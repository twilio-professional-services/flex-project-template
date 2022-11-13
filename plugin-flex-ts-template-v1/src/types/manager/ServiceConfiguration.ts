import * as Flex from '@twilio/flex-ui';

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

// feature: activity-skill-filter
export type ActivitySkillFilterRule = {
  required_skill: string;
  sort_order: number;
};

export type ActivitySkillFilterRules = {
  [key: string]: ActivitySkillFilterRule;
};

// feature: activity-reservation-handler
export type SystemActivityNames = {
  [index: string]: string;
  available: string;
};


export interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    serverless_functions_domain: string;
    serverless_functions_protocol: string;
    serverless_functions_port: string;
    features: {
      activity_reservation_handler: {
        enabled: boolean;
        system_activity_names: SystemActivityNames;
      };
      activity_skill_filter: {
        enabled: boolean;
        filter_teams_view: boolean;
        rules: ActivitySkillFilterRules;
      };
      callbacks: {
        enabled: boolean;
        allow_requeue: boolean;
        max_attempts: number;
        auto_select_task: boolean;
      };
      caller_id: {
        enabled: boolean;
      };
      chat_transfer: {
        enabled: boolean;
      };
      enhanced_crm_container: {
        enabled: boolean;
      };
      override_queue_transfer_directory: {
        enabled: boolean;
      };
      scrollable_activities: {
        enabled: boolean;
      };
      supervisor_barge_coach: {
        enabled: boolean;
        agent_coaching_panel: boolean;
        supervisor_monitor_panel: boolean;
      };
      omni_channel_capacity_management: {
        enabled: boolean
      }
    };
  };
}
