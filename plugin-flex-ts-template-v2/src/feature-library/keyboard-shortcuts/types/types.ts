export interface ShortcutsObject {
  key: string;
  actionName: string;
  throttle?: number;
  action: Function;
}

export interface CustomShortcut {
  key: string;
  actionName: string;
  throttle: number;
}

export interface ShortcutActions {
  [x: string]: Function;
}

export interface RemapShortcutObject {
  action: Function;
  name: string;
  throttle: number;
}
