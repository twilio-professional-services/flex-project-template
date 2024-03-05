export interface MapItem {
  data: any;
  key: string;
  descriptor?: {
    created_by?: string;
    date_expires?: string;
    date_created?: string;
    date_updated?: string;
    map_sid?: string;
    revision?: string;
    service_sid?: string;
    url?: string;
  };
}
