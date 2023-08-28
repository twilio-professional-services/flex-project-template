import * as Flex from '@twilio/flex-ui';

import { FlexJsClient, WorkerEvent } from '../../../../../types/feature-loader';
import { Reservation } from '../../../../../types/task-router';
import AudioPlayerManagerHelper from '../../../helpers/audioPlayerManagerHelper';

// With this feature we are using jsClientHook instead of manager events since it makes code much simpler.
export const clientName = FlexJsClient.workerClient;
export const eventName = WorkerEvent.reservationCreated;
export const jsClientHook = function reservationCreatedHandler(
  flex: typeof Flex,
  manager: Flex.Manager,
  reservation: Reservation,
) {
  const { task } = reservation;
  const { taskChannelUniqueName, attributes: taskAttributes } = task;
  const { direction } = taskAttributes;

  if (direction === 'inbound' && taskChannelUniqueName === 'voice') {
    AudioPlayerManagerHelper.play();
    reservation.on('accepted', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('canceled', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('rejected', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('timeout', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
  }
  if (direction === 'inbound' && taskChannelUniqueName === 'chat') {
    AudioPlayerManagerHelper.play();
    reservation.on('accepted', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('canceled', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('rejected', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
    reservation.on('timeout', (_reservation: any) => {
      AudioPlayerManagerHelper.stop();
    });
  }
};
