export default interface DataTilesConfig {
  enabled: boolean;
  queues_view_tiles: {
    all_channels_data_tile: boolean;
    all_channels_sla_data_tile: boolean;
    agents_by_activity_bar_chart: boolean;
    enhanced_agent_by_activity_pie_chart: boolean;
  };
  teams_view_tiles: {
    task_summary_tile: boolean;
    team_activity_tile: boolean;
    status_idle_color: string;
    status_busy_color: string;
    status_idle_name: string;
  };
  channels: Channels;
  agent_activity_configuration: {
    activities: {
      [key: string]: ActivityConfig;
    };
    other: ActivityConfig;
  };
}

export interface Channels {
  [key: string]: ChannelConfig;
}

export interface ChannelConfig {
  color: string;
  SLA_data_tile: boolean;
  task_counts_data_tile: boolean;
  teams_task_summary: boolean;
}

interface ActivityConfig {
  color: string;
  icon: string;
}
