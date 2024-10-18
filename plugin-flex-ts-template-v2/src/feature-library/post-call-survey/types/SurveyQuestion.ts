import { AnswerOptions } from './AnswerOptions';

export interface ISurveyQuestion {
  label: string;
  prompt: string;
  answers: string;
  answer_options?: AnswerOptions;
}

export class SurveyQuestion implements ISurveyQuestion {
  label: string = '';

  prompt: string = '';

  answers: string = '';

  answer_options?: AnswerOptions;
}
