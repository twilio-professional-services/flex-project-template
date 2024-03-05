export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  global: WrapUpConfig;
  per_queue: { [key: string]: WrapUpConfig };
}

export interface WrapUpConfig {
  dispositions: string[];
  require_disposition: boolean;
  text_attributes: Array<CustomAttribute>;
  select_attributes: Array<SelectAttribute>;
}

export interface CustomAttribute {
  form_label: string;
  conversation_attribute: string;
  required?: boolean;
}

export interface SelectAttribute extends CustomAttribute {
  options: string[];
  multi_select: boolean;
}
