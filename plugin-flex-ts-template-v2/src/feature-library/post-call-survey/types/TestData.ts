import { ISurveyDefinition } from './SurveyDefinition';

export const ExampleSurveyDefinition1: ISurveyDefinition = {
  name: 'Some survey',
  last_updated_by: 'System',
  message_intro: 'yo yo',
  questions: [
    {
      label: 'NPS',
      prompt: "Who's your daddy?",
      answers: '',
      answer_options: {
        0: true,
        1: false,
        2: false,
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
      label: 'CSAT',
      prompt: "Who's your daddy?",
      answers: '',
      answer_options: {
        0: true,
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
  ],
  message_end: 'bye bye',
};

export const ExampleSurveyDefinition2: ISurveyDefinition = {
  name: 'Some survey',
  last_updated_by: 'System',
  message_intro: 'yo yo',
  questions: [
    {
      label: '',
      prompt: '',
      answers: '',
      answer_options: {
        0: true,
        1: false,
        2: false,
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
      label: '',
      prompt: '',
      answers: '',
      answer_options: {
        0: true,
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
  ],
  message_end: '',
};
