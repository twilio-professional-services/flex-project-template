export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  require_disposition: boolean;
  global_dispositions: string[];
  per_queue: { [key: string]: DispositionsPerQueueConfig };
  text_attributes: Array<CustomAttribute>;
  boolean_attributes: Array<CustomAttribute>;
}

interface CustomAttribute {
  form_label: string;
  conversations_attribute: string;
}

export interface DispositionsPerQueueConfig {
  require_disposition: boolean;
  dispositions: string[];
}
