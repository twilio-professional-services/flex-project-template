import ActivityHandlerAdmin from './custom-components/ActivityHandlerAdmin/ActivityHandlerAdmin';

export const adminHook = function addActivityReservationHandlerAdmin(payload: any) {
  if (payload.feature !== 'activity_reservation_handler') return;
  payload.component = <ActivityHandlerAdmin {...payload} />;
  payload.hideDefaultComponents = true;
};
