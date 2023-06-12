export interface ShortcutsObject {
  key: string;
  actionName: string;
  throttle?: number;
  action: any;
}

export interface CustomShortcut {
  key: string;
  actionName: string;
  throttle: number;
}

export interface ShortcutActions {
  [x: string]: () => void;
}

export interface RemapShortcutObject {
  action: () => void;
  name: string;
  throttle: number;
}
