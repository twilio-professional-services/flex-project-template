export type SystemActivityNames = {
  [index: string]: string;
  available: string;
};
export default interface ActivityReservationHandlerConfig {
  enabled: boolean;
  system_activity_names: SystemActivityNames;
}
