import * as Flex from '@twilio/flex-ui';
import { AppState } from 'flex-hooks/states';
import { sortBy } from 'lodash';
import { Activity } from 'types/task-router';
import { ActivitySkillFilterRules } from '../types/ServiceConfiguration';
import { getRules } from '..';

export interface ActivityCssConfig {
  idx: number,
  display: string,
  order: number
}

class AgentActivities {
  manager: Flex.Manager;
  config: ActivitySkillFilterRules

  constructor() {
    this.manager = Flex.Manager.getInstance();
  
    // the supporting configuration for this utility is expected to be set 
    // as a custom element on the ui_attributes of the flex configuration
    // see README for more details
    this.config = getRules();
  }

  // NOTE: This will hide any TR activities that are NOT set in the flex config
  // So make sure the deployed flex config contains all activities you'd like to appear in this menu
  getCSSConfig(): Array<ActivityCssConfig> {
    const { flex } = this.manager.store.getState() as AppState;
    const { attributes, activities } = flex.worker;
    const { routing = { skills: [], levels: {} } } = attributes;
    const skills = routing.skills || [];
  
    return Array.from(activities.values()).reduce((results, activity, idx) => {
      // default the cssConfig to hide this element
      let cssConfig: ActivityCssConfig = { idx, display: 'none', order: idx };
      // fetch activity from the config stored in ui_attributes.agentActivityRules
      const activityRule = this.config[activity.sid];
      // if the activity exists
      if (activityRule) {
        const { required_skill, sort_order } = activityRule;
        // and if there are no skills required or skill is available
        if (!required_skill || skills.includes(required_skill)) {
          // show the activity
          cssConfig.display = 'flex';
        }
        // set the order of the activity
        cssConfig.order = sort_order;
      }
      // return the element with all previous results into one array
      return [...results, cssConfig];
    }, [] as Array<ActivityCssConfig>);
  }


  // NOTE: This will hide any TR activities that are NOT set in the flex config
  // So make sure the deployed flex config contains all activities you'd like to appear in this menu
  // This will also include the worker's current activity even if it is not an allowed one, so that the menu can render the current state correctly
  getEligibleActivites(worker: Flex.IWorker): Array<Activity> {
    const { flex } = this.manager.store.getState() as AppState;
    const { attributes, activities } = flex.worker;
    const { routing = { skills: [], levels: {} } } = attributes;
    let skills = routing.skills || [];
  
    if (worker) {
      const { routing: agentRouting = { skills: [], levels: {} } } = worker.attributes;
      skills = agentRouting.skills || [];
    }
    
    const eligibleSkills = Array.from(activities.values()).reduce((results: any, activity) => {
      const activityRule = this.config[activity.sid];
      if (activityRule) {
        const { required_skill, sort_order } = activityRule;
        if (!required_skill || skills.includes(required_skill) || worker.activityName === activity.name) {
          return [...results, { sort_order, activity }];
        }
      } else if (worker.activityName === activity.name) {
        return [...results, { sort_order: -1, activity }];
      }
      return results;
    }, []);
  
    return sortBy(eligibleSkills, 'sort_order').map(result => result.activity);
  }
}

export default new AgentActivities();
