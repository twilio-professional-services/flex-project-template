import * as Flex from '@twilio/flex-ui';

import { FlexJsClient, WorkerEvent } from '../../../../../types/feature-loader';
import { Reservation } from '../../../../../types/task-router';
import AudioPlayerManagerHelper from '../../../helpers/audioPlayerManagerHelper';

// With this feature we are using jsClientHook instead of manager events since it makes code much simpler.
export const clientName = FlexJsClient.workerClient;
export const eventName = WorkerEvent.reservationCreated;
export const jsClientHook = function playAudioOnReservationCreated(
  flex: typeof Flex,
  manager: Flex.Manager,
  reservation: Reservation,
) {
  const { task } = reservation;
  const { attributes } = task;
  const { direction } = attributes;

  if (direction !== 'inbound') {
    return;
  }

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
  reservation.on('rescinded', (_reservation: any) => {
    AudioPlayerManagerHelper.stop();
  });
  reservation.on('timeout', (_reservation: any) => {
    AudioPlayerManagerHelper.stop();
  });
};
