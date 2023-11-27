export interface DirectoryEntry {
  cold_transfer_enabled: boolean;
  warm_transfer_enabled: boolean;
  icon?: React.JSX.Element;
  label: string;
  labelComponent?: React.JSX.Element;
  address: string;
  tooltip?: string;
  type: 'number' | 'queue' | 'worker';
}

export interface ExternalDirectoryEntry {
  cold_transfer_enabled: boolean;
  warm_transfer_enabled: boolean;
  label: string;
  number: string;
}
