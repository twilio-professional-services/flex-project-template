export interface PendingActivity {
  name: string;
}

export interface CallbackPromise {
  resolve: any;
  reject: any;
  available?: boolean;
}
