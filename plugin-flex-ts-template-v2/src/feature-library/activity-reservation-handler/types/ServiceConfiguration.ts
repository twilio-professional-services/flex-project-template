export default interface ActivityReservationHandlerConfig {
  enabled: boolean;
  system_activity_names: {
    available: string;
    onATask: string;
    onATaskNoAcd: string;
    wrapup: string;
    wrapupNoAcd: string;
    extendedWrapup: string;
  };
}
