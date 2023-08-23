import * as Flex from '@twilio/flex-ui';
import { FlexJsClient, WorkerEvent } from '../../../../../types/feature-loader';
import { Reservation } from 'types/task-router';
import AudioPlayerManagerHelper from '../../../helpers/audioPlayerManagerHelper';

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

  if (direction === 'inbound' && taskChannelUniqueName == 'voice') {
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
