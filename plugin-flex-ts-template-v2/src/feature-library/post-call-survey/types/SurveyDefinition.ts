import { ISurveyQuestion } from './SurveyQuestion';

export interface ISurveyDefinition {
  name: string;
  last_updated_by: string;
  message_intro: string;
  questions: ISurveyQuestion[];
  message_end: string;
}

export class SurveyDefinition implements ISurveyDefinition {
  name: string = '';

  last_updated_by: string = '';

  message_intro: string = '';

  questions: ISurveyQuestion[] = [];

  message_end: string = '';
}
