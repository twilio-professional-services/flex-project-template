import { Actions } from '@twilio/flex-ui';

import { HangUpBy } from '../../enums/hangUpBy';
import * as HangUpByHelper from '../../helpers/hangUpBy';

export const registerSetHangUpByAction = async () => {
  Actions.registerAction(
    'SetHangUpBy',
    async (payload: {
      reservationSid: string;
      hangupby: HangUpBy;
      setAttributes?: { taskSid: string; taskAttributes: any; destination?: string };
    }) => {
      const { reservationSid, hangupby, setAttributes } = payload;
      HangUpByHelper.setHangUpBy(reservationSid, hangupby);
      if (setAttributes) {
        await HangUpByHelper.setHangUpByAttribute(
          setAttributes.taskSid,
          setAttributes.taskAttributes,
          hangupby,
          setAttributes.destination,
        );
      }
    },
  );
};
