export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  require_disposition: boolean;
  global: WrapUpConfig;
  per_queue: { [key: string]: DispositionsPerQueueConfig };
}

export interface WrapUpConfig {
  dispositions: string[];
  text_attributes: Array<CustomAttribute>;
  select_attributes: Array<SelectAttribute>;
  multi_select_group: SelectAttribute;
}

export interface CustomAttribute {
  form_label: string;
  conversation_attribute: string;
  required?: boolean;
}

export interface SelectAttribute extends CustomAttribute {
  options: string[];
}

export interface DispositionsPerQueueConfig extends WrapUpConfig {
  require_disposition: boolean;
}
