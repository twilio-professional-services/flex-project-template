export interface IRuleDefinition {
  queue_name: string;
  survey_key: string;
  active: boolean;
}

export class RuleDefinition implements IRuleDefinition {
  queue_name: string = '';

  survey_key: string = '';

  active: boolean = false;
}
