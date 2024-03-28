import { MapItem } from './MapItem';

export interface ISurveyDefinition {
  name: string;
  last_updated_by: string;
  message_intro: string;
  questions: ISurveyQuestion[];
  message_end: string;
}

export type AnswerOptions = {
  [key in '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9']: boolean;
};

export interface ISurveyQuestion {
  label: string;
  prompt: string;
  answers: string;
  answer_options?: AnswerOptions;
}

export type SurveyAnswers = { label: string; answers: AnswerOptions };

export enum Phase {
  SurveyList = 'Survey List',
  SurveyEditor = 'Survey Designer',
  RuleEditor = 'Rule Editor',
}

export class SurveyQuestion implements ISurveyQuestion {
  label: string = '';
  prompt: string = '';
  answers: string = '';
  answer_options?: AnswerOptions;
}

export class SurveyDefinition implements ISurveyDefinition {
  name: string = '';
  last_updated_by: string = '';
  message_intro: string = '';
  questions: ISurveyQuestion[] = [];
  message_end: string = '';
}

export class SurveyItem implements MapItem {
  key: string;
  data: ISurveyDefinition;
  descriptor: {
    account_sid: string;
    created_by: string;
    date_expires: string;
    date_created: string;
    date_updated: string;
    map_sid: string;
    revision: string;
    service_sid: string;
    url: string;
  };

  constructor(key: string) {
    this.key = key;
    this.data = new SurveyDefinition();
    this.descriptor = {
      account_sid: '',
      created_by: '',
      date_expires: '',
      date_created: '',
      date_updated: '',
      map_sid: '',
      revision: '',
      service_sid: '',
      url: '',
    };
  }
}
