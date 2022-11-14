import * as Flex from '@twilio/flex-ui';
import { Task } from '../../../types/task-router';
import Reservation from '../../../../test-utils/task-router/Reservation';
import registerReservationCreatedListener from './reservationCreated';

describe('flex-hooks/jsclient-event-listeners/worker-client/reservationCreated', () => {
  beforeAll(() => {
    registerReservationCreatedListener(Flex, Flex.Manager.getInstance());
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should not auto-accept tasks when channel is not voice', () => {
    const inboundTask = { taskChannelUniqueName: 'chat', transfers: {}, attributes: { direction: 'inbound' } } as Task;
    const outboundTask = { taskChannelUniqueName: 'voice', transfers: {}, attributes: { direction: 'outbound' } } as Task;
    Flex.Manager.getInstance().workerClient.emit('reservationCreated', new Reservation('testSid', inboundTask));
    Flex.Manager.getInstance().workerClient.emit('reservationCreated', new Reservation('testSid', outboundTask));

    expect(Flex.Actions.invokeAction).toBeCalledTimes(0);
  });
});
