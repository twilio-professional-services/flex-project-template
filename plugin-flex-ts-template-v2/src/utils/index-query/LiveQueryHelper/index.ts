import * as Flex from '@twilio/flex-ui';
import { LiveQuery } from 'twilio-sync/lib/livequery';

import { LiveQueryAddedEvent, LiveQueryUpdatedEvent, LiveQueryRemovedEvent } from './types';

export * from './types';

export default abstract class LiveQueryHelper<T> {
  readonly indexName: string;

  readonly queryExpression: string;

  protected manager = Flex.Manager.getInstance();

  #items?: { [key: string]: T };

  #liveQuery?: LiveQuery;

  #initializing?: Promise<LiveQuery>;

  // For queryExpression syntax, see: https://www.twilio.com/docs/sync/live-query
  // eslint-disable-next-line no-restricted-syntax
  constructor(indexName: string, queryExpression: string) {
    this.indexName = indexName;
    this.queryExpression = queryExpression;
  }

  protected get liveQuery() {
    if (this.#initializing === undefined) {
      this.#initializing = this.#initLiveQuery();
    }
    return this.#initializing;
  }

  // Functions derived classes can implement to hook into lifecycle events
  protected onItemAdded?(event: LiveQueryAddedEvent<T>): void;

  protected onItemUpdated?(event: LiveQueryUpdatedEvent<T>): void;

  protected onItemRemoved?(event: LiveQueryRemovedEvent): void;

  protected async startLiveQuery(): Promise<{ [key: string]: T }> {
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
      this.#liveQuery = await this.manager.insightsClient.liveQuery(this.indexName, this.queryExpression);
      this.#items = this.#liveQuery.getItems() as unknown as {
        [key: string]: T;
      };
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
  };

  #onItemUpdated = (event: LiveQueryUpdatedEvent<T>): void => {
    const data = { ...this.#items };
    const existingItem = Object.keys(data).includes(event.key);
    this.#items = { ...data, [event.key]: event.value };
    if (existingItem && this.onItemUpdated) {
      this.onItemUpdated(event);
    } else if (this.onItemAdded) {
      const addedEvent: LiveQueryAddedEvent<T> = { ...event };
      this.onItemAdded(addedEvent);
    }
  };

  #onItemRemoved = (event: LiveQueryRemovedEvent): void => {
    const data = { ...this.#items };
    delete data[event.key];
    this.#items = { ...data };
    if (this.onItemRemoved) {
      this.onItemRemoved(event);
    }
  };
}
