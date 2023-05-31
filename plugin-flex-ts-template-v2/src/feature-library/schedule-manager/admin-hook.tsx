import ScheduleAdmin from './custom-components/ScheduleAdmin/ScheduleAdmin';

export const adminHook = function addScheduleManagerAdmin(payload: any) {
  if (payload.feature !== 'schedule_manager') return;
  payload.component = <ScheduleAdmin {...payload} />;
};
