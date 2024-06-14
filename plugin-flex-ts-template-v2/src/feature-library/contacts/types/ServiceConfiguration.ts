export default interface ContactsConfig {
  enabled: boolean;
  enable_recents: boolean;
  enable_personal: boolean;
  enable_shared: boolean;
  recent_days_to_keep: number;
  shared_agent_editable: boolean;
  page_size: number;
}
