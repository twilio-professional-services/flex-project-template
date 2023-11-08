export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  require_disposition: boolean;
  global_dispositions: string[];
  per_queue: { [key: string]: DispositionsPerQueueConfig };
  text_attributes: Array<CustomAttribute>;
  select_attributes: Array<SelectAttribute>;
}

interface CustomAttribute {
  form_label: string;
  conversation_attribute: string;
  required?: boolean;
}

interface SelectAttribute extends CustomAttribute {
  options: string[];
}

export interface DispositionsPerQueueConfig {
  require_disposition: boolean;
  dispositions: string[];
}
