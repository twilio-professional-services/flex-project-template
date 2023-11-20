import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import ApiService from '../../../utils/serverless/ApiService';
import { RuleItem } from '../types/Rule';
import { ISurveyDefinition, SurveyItem } from '../types/Survey';

import SyncHelper from './SyncHelper';
import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import { getRuleDefinitionsMapName, getSurveyDefinitionsMapName } from '../config';

class SurveyService extends ApiService {
  getQueueNames = async (): Promise<string[]> => {
    const myPromise = new Promise<string[]>((resolve, reject) => {
      TaskRouterService.getQueues()
        .then((queues) => {
          let listOfQueues = queues?.map((q) => q.friendlyName);
          if (listOfQueues !== undefined) {
            resolve(listOfQueues);
          } else {
            reject('Error getting queue names');
          }
        })
        .catch((e) => reject(e));
    });
    return myPromise;
  };

  getSurveys = async (): Promise<SurveyItem[]> => {
    return SyncHelper.getMapItems(getSurveyDefinitionsMapName());
  };

  saveSurvey = async (key: string, survey: ISurveyDefinition) => {
    return (await SyncClient.map(getSurveyDefinitionsMapName())).update(key, survey);
  };

  deleteSurvey = async (key: string) => {
    return (await SyncClient.map(getSurveyDefinitionsMapName())).remove(key);
  };

  generateSurveyKey = () => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 30) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return 'PCSS' + result;
  };

  createNewSurveyItem = (): SurveyItem => {
    return new SurveyItem(this.generateSurveyKey());
  };

  generateRuleKey = () => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 30) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return 'PCSR' + result;
  };

  getRules = async (): Promise<RuleItem[]> => {
    return SyncHelper.getMapItems(getRuleDefinitionsMapName());
  };

  saveRule = async (rule: RuleItem) => {
    return (await SyncClient.map(getRuleDefinitionsMapName())).update(rule.key, rule.data);
  };

  deleteRule = async (key: string) => {
    return (await SyncClient.map(getRuleDefinitionsMapName())).remove(key);
  };

  createNewRule = (): RuleItem => {
    return new RuleItem(this.generateRuleKey());
  };
}

const service = new SurveyService();

export default service;
