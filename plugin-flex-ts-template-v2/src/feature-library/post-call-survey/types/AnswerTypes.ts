import { SurveyAnswers } from './SurveyAnswers';

export const answerToTypeMap: SurveyAnswers[] = [
  {
    label: 'DTMF 1 and 2 Binary (Yes, No)',
    answers: {
      0: false,
      1: true,
      2: true,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
    },
  },
  {
    label: 'DTMF 1 to 3 Scale (e.g. Agree, Impartial, Disagree)',
    answers: {
      0: false,
      1: true,
      2: true,
      3: true,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
    },
  },
  {
    label: 'DTMF 1 to 5 Scale (e.g. Star Rating)',
    answers: {
      0: false,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: false,
      7: false,
      8: false,
      9: false,
    },
  },
  {
    label: 'DTMF 0 to 9 Scale (e.g. NPS)',
    answers: {
      0: false,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
];
