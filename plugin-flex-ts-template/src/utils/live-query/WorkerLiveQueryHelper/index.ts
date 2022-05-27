import * as Flex from '@twilio/flex-ui';
import { LiveQuery } from 'twilio-sync/lib/livequery';
import { Worker } from '../../../types/sync/LiveQuery';
import { LiveQueryWorkerAddedEvent, LiveQueryWorkerUpdatedEvent, LiveQueryWorkerRemovedEvent } from './types';

export * from './types';

export default abstract class WorkerLiveQueryHelper {
  readonly queryExpression: string;
  protected manager = Flex.Manager.getInstance();
  #items?: { [workerSid:string]: Worker };
  #liveQuery?: LiveQuery;
  #initializing?: Promise<LiveQuery>;
  protected get liveQuery() {
    if (this.#initializing === undefined) {
      this.#initializing = this.#initLiveQuery();
    }
    return this.#initializing;
  }

  // Functions derived classes can implement to hook into lifecycle events
  protected onItemAdded?(event: LiveQueryWorkerAddedEvent): void;
  protected onItemUpdated?(event: LiveQueryWorkerUpdatedEvent): void;
  protected onItemRemoved?(event: LiveQueryWorkerRemovedEvent): void;

  // For queryExpression syntax, see: https://www.twilio.com/docs/sync/live-query
  constructor(queryExpression: string) {
    this.queryExpression = queryExpression;
  }

  protected async startLiveQuery(): Promise<{ [workerSid:string]: Worker }> {
    await this.liveQuery;
    return this.#items || {};
  }

  protected async closeLiveQuery(): Promise<void> {
    if (this.#liveQuery) {
      this.#liveQuery.close();
      this.#liveQuery = undefined;
    }
    this.#initializing = undefined;
    this.#items = undefined;
  }

  #initLiveQuery = async (): Promise<LiveQuery> => {
    try {
      this.#liveQuery = await this.manager.insightsClient.liveQuery('tr-worker', this.queryExpression);
      this.#items = this.#liveQuery.getItems() as { [workerSid:string]: Worker };
      this.#liveQuery
        .on('itemUpdated', this.#onItemUpdated.bind(this))
        .on('itemRemoved', this.#onItemRemoved.bind(this));
      return this.#liveQuery;
    } catch (e) {
      if (this.#liveQuery) {
        this.#liveQuery.close();
        this.#liveQuery = undefined;
      }
      this.#initializing = undefined;
      this.#items = undefined;
      throw e;
    }
  }

  #onItemUpdated = (event: LiveQueryWorkerUpdatedEvent): void => {
    const data = { ...this.#items };
    const existingItem = Object.keys(data).includes(event.key);
    this.#items = { ...data, [event.key]: event.value };
    if (existingItem) {
      this.onItemUpdated && this.onItemUpdated(event);
    } else {
      const addedEvent: LiveQueryWorkerAddedEvent = { ...event };
      this.onItemAdded && this.onItemAdded(addedEvent);
    }
  }

  #onItemRemoved = (event: LiveQueryWorkerRemovedEvent): void => {
    const data = { ...this.#items };
    delete data[event.key];
    this.#items = { ...data };
    this.onItemRemoved && this.onItemRemoved(event);
  }
}
