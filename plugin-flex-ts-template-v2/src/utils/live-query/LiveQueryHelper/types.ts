export interface LiveQueryAddedEvent<T> {
  key: string;
  value: T;
}

export interface LiveQueryUpdatedEvent<T> {
  key: string;
  value: T;
}

export interface LiveQueryRemovedEvent {
  key: string;
}
