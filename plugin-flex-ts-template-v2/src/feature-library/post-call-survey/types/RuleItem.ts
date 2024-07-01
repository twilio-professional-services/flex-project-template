/* eslint-disable no-restricted-syntax */
import { MapItem } from './MapItem';
import { IRuleDefinition, RuleDefinition } from './RuleDefinition';

export class RuleItem implements MapItem {
  data: IRuleDefinition;

  key: string;

  descriptor?: {
    created_by?: string | undefined;
    date_expires?: string | undefined;
    date_created?: string | undefined;
    date_updated?: string | undefined;
    map_sid?: string | undefined;
    revision?: string | undefined;
    service_sid?: string | undefined;
    url?: string | undefined;
  };

  constructor(key: string) {
    this.data = new RuleDefinition();
    this.key = key;
    this.descriptor = {}; // Add initializer for the descriptor property
  }
}
