var appConfig = {
  pluginService: {
    enabled: true,
    url: "/plugins",
  },
  ytica: false,
  logLevel: "info",
  showSupervisorDesktopView: true,
  custom_data: {
    serverless_functions_protocol: "http",
    serverless_functions_port: "3001",
    serverless_functions_domain: "localhost",
    features: {
      activity_skill_filter: {
        enabled: false,
        filter_teams_view: false
      },
      callbacks: {
        enabled: true,
        allow_requeue: true,
        max_attempts: 3,
        auto_select_task: true
      },
      caller_id: {
        enabled: true
      },
      chat_transfer: {
        enabled: false
      },
      chat_to_video_escalation: {
        enabled: false
      },
      conference: {
        enabled: true
      },
      enhanced_crm_container: {
        enabled: true
      },
      internal_call: {
        enabled: true
      },
      override_queue_transfer_directory: {
        enabled: false
      },
      scrollable_activities: {
        enabled: true
      },
      supervisor_barge_coach: {
        enabled: true,
        agent_coaching_panel: true,
        supervisor_monitor_panel: true
      },
      omni_channel_capacity_management: {
        enabled: false
      },
      device_manager: {
        enabled: true
      },
      dual_channel_recording: {
        enabled: false,
        channel: "worker"
      },
      pause_recording: {
        enabled: true,
        include_silence: false,
        indicator_banner: false,
        indicator_permanent: true
      },
      activity_reservation_handler: {
        enabled: false,
      },
      teams_view_filters: {
        enabled: true,
        logFilters: true,
        applied_filters: {
          email: true,
          department : true,
          queue_no_worker_data: true,
          queue_worker_data: false,
          team: true,
          agent_skills: true
        },
        department_options: [
          "General Management",
          "Marketing",
          "Operations",
          "Finance",
          "Sales",
          "Human Resources",
          "Purchasing",
          "Customer Service",
          "Recruiting"
        ],
        team_options :[
          "Blue Team",
          "Red Team",
          "Gold Team",
          "VIP Team",
          "Orange Team",
          "Yellow Team",
          "Green Team",
          "Purple Team",
          "Gray Team"
        ]
      },
      supervisor_capacity: {
        enabled: true
      },
      schedule_manager: {
        enabled: false
      }
    }
  },
};


