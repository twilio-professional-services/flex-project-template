/* eslint-disable no-restricted-syntax */
import { MapItem } from './MapItem';
import { ISurveyDefinition, SurveyDefinition } from './SurveyDefinition';

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
