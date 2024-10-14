import { EncodedParams } from 'types/serverless';

import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import ApiService from '../../../utils/serverless/ApiService';
import { RuleItem } from '../types/RuleItem';
import { ISurveyDefinition } from '../types/SurveyDefinition';
import { SurveyItem } from '../types/SurveyItem';
import SyncHelper from './SyncHelper';
import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import { getRuleDefinitionsMapName, getSurveyDefinitionsMapName } from '../config';

class SurveyService extends ApiService {
  getQueueNames = async (): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
      TaskRouterService.getQueues()
        .then((queues) => {
          const listOfQueues = queues?.map((q) => q.friendlyName);
          if (listOfQueues === undefined) {
            reject('Error getting queue names');
          } else {
            resolve(listOfQueues);
          }
        })
        .catch((e) => reject(e));
    });
  };

  startSurvey = async (queueName: string, callSid: string, taskSid: string, surveyKey: string) => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        queueName: encodeURIComponent(queueName),
        callSid: encodeURIComponent(callSid),
        taskSid: encodeURIComponent(taskSid),
        surveyKey: encodeURIComponent(surveyKey),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<any>(
        // `https://6e6d12fab128.ngrok.app/features/post-call-survey/flex/start-voice-survey`,
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/post-call-survey/flex/start-voice-survey`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((error) => {
          console.log('Error starting post call survey', error);
          reject(error);
        });
    });
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
    return `PCSS${result}`;
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
    return `PCSR${result}`;
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
