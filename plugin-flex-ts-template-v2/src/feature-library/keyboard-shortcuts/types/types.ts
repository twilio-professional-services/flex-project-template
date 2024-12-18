export interface ShortcutsObject {
  key: string;
  actionName: string;
  throttle?: number;
  action: any;
}

export interface ShortcutActions {
  [x: string]: () => void;
}

export interface RemapShortcutObject {
  action: () => void;
  name: string;
  throttle: number;
}
