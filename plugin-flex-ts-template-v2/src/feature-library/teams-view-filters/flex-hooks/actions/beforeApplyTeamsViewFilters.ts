import * as Flex from '@twilio/flex-ui';
import { AppliedFilter } from '@twilio/flex-ui/src/state/Supervisor/SupervisorState.definitions';

import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { TeamViewQueueFilterNotification } from '../notifications/TeamViewQueueFilter';
import { isQueueNoWorkerDataFilterEnabled } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { selectQueue, ResetQueuePlaceholder } from '../states/QueueNoWorkerDataFilterSlice';

export interface ApplyTeamsViewFiltersPayload {
  extraFilterQuery?: string;
  filters: Array<AppliedFilter>;
}

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.ApplyTeamsViewFilters;
export const actionHook = function interceptQueueFilter(flex: typeof Flex, manager: Flex.Manager) {
  if (!isQueueNoWorkerDataFilterEnabled()) return;
  replaceQueueFiltersForTeamView(flex, manager);
};

// this method supports the application of a queue filter to the teams view but
// this is only possible for a subset of queue expressions, not all queue expressions
// can be supported.  This is because each individual expression in the TeamsFilter
// is explicitly OR'd on a single attribute and each expression in the TeamsFilter
// array is AND'd.  Since a queue expression can be made up of AND's and OR's its
// impossible to apply those types of expression across this interface
//
// TeamsFilter array item:
//
// {
//    condition: IN,
//    name: data.attributes.email
//    values: ['example@gmail.com', 'example+1@gmail.com']  <-- these values are OR'd
// } <---- each array item is AND'd.
//
// note in the expression above only one element can be examined
// i.e data.attributes.email.
//
// if there are multiple expressions in the queue expression - these are expected
// to be AND'd. The existence of any OR expressions will result in ignoring the
// queue filter. Also only these qualifiers are supported
// HAS|==|EQ|!=|CONTAINS|IN|NOT IN

//
// a more comprehensive solution can be found by leveraging a backend to
// keep track of queue:worker eligibiility and keeping eligible queue sids
// synced on each individual worker object so it can be queried with a much
// simpler query filter like:
//
// data.attributes.queues IN [<queue-sid>]
//

function replaceQueueFiltersForTeamView(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(
    `${actionEvent}${actionName}`,
    async (payload: ApplyTeamsViewFiltersPayload, _abortFunction: () => void) => {
      const { filters } = payload;

      let queueEligibilityFilter = null as AppliedFilter | null;

      // identify any queue filter placeholders in the selection
      filters.forEach((filter: AppliedFilter) => {
        if (filter.name === 'queue-replacement') queueEligibilityFilter = filter as AppliedFilter;
      });

      // if no queue filters return
      if (!queueEligibilityFilter || queueEligibilityFilter.values.length < 1) {
        // clear any selected queue in state, since we know none are selected
        manager.store.dispatch(selectQueue(''));
        return;
      }

      // remove the replacement filter
      const newFilter = filters.filter((filter: AppliedFilter) => filter.name !== 'queue-replacement');
      payload.filters = newFilter;

      // now find the queue for the replaced filter
      // and get the queue eligibility expression
      let queue;
      const queueFiltersArray: Array<AppliedFilter> = [];

      try {
        const fetchedQueues = await TaskRouterService.getQueues();
        const queues = fetchedQueues ? fetchedQueues : [];
        queue = queues.find((queue) => {
          return queue.friendlyName === queueEligibilityFilter?.values[0];
        });
      } catch (error) {
        console.error('teams-view-filters: Unable to get queues', error);
      }

      // if there is no queue found notify user
      if (!queue) {
        Flex.Notifications.showNotification(TeamViewQueueFilterNotification.ErrorLoadingQueue);
        // clear any selected queue in state
        manager.store.dispatch(selectQueue(ResetQueuePlaceholder));
        return;
      }
      const { targetWorkers } = queue;

      // if the targetWorkers is 1==1 we can ignore it
      if (targetWorkers !== '1==1') {
        // assuming expressions are formatted as explained above
        const expressionComponents = targetWorkers.match(
          /((\b(?:\.)+\S+\b|\b(?:\S+)+\S+\b)(\s)+(HAS|==|EQ|!=|CONTAINS|IN|NOT IN)(\s)+(('|")\S+('|")))/gi,
        );
        const containsORs = targetWorkers.includes(' OR ');

        // validate expressions have been parsed and that there are no OR'd statements
        if (!expressionComponents || expressionComponents.length === 0) {
          Flex.Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpression);
          // clear any selected queue in state
          manager.store.dispatch(selectQueue(ResetQueuePlaceholder));
          return;
        } else if (containsORs) {
          Flex.Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR);
          // clear any selected queue in state
          manager.store.dispatch(selectQueue(ResetQueuePlaceholder));
          return;
        }

        // for each expression break it down and create a filter
        let parseFailure = false;
        expressionComponents.forEach((expression) => {
          const tempName = RegExp(/(\b(?:\.)+\S+\b|\b(?:\S+)+\S+\b)/, 'i').exec(expression);
          const tempCondition = RegExp(/( HAS |==|!=| CONTAINS | IN | NOT IN )/, 'i').exec(expression);
          const tempValue = RegExp(/(('|")\S+('|"))/, 'i').exec(expression);

          // pulling out the same value multiple times
          // even though we expect it only to pull it out once so just checking
          // result is > 0
          // we than parse out any invalid characters such as spaces and format
          // any conditions that need replaced (currently all other conditions
          // referenced in regex are compatible with livequery language
          // liveQuery syntax: https://www.twilio.com/docs/sync/live-query#query-operators
          // task router expression syntax: https://www.twilio.com/docs/taskrouter/expression-syntax#comparison-operators
          if (
            tempName &&
            tempName.length > 0 &&
            tempCondition &&
            tempCondition.length > 0 &&
            tempValue &&
            tempValue.length > 0
          ) {
            const name = `data.attributes.${tempName[0]}`;
            const condition = tempCondition[0].replace(/has/i, 'IN').replace(/[^a-zA-Z=!]/g, '');
            const values = [tempValue[0].replace(/[^0-9a-zA-Z_-]/g, '')];

            const tempFilter = {
              name,
              condition,
              values,
            } as AppliedFilter;
            queueFiltersArray.push(tempFilter);
          } else {
            Flex.Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpression);
            parseFailure = true;
          }
        });

        if (parseFailure) {
          // clear any selected queue in state
          manager.store.dispatch(selectQueue(ResetQueuePlaceholder));
          return;
        }

        payload.filters = [...newFilter, ...queueFiltersArray];
      }

      // store selected queue in state so that the UI can display it properly
      manager.store.dispatch(selectQueue(queue.friendlyName));
    },
  );
}
