import * as JsClientEvents from '../jsclient-event-listeners';
import * as Flex from '@twilio/flex-ui';
import { FlexJsClient, ConversationEvent, VoiceEvent, WorkerEvent } from '../../../types/feature-loader';
import {expect, jest, describe, it} from '@jest/globals';

describe('JsClient Events - addHook', () => {
  const manager = Flex.Manager.getInstance();

  it('should log a console info messsage and return early if hook does not have clientName', () => {
    const hook = { eventName: 'someEvent' };
    const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(jest.fn());
    JsClientEvents.addHook(Flex, manager, 'test-feature-name', hook);
    expect(mockConsoleInfo).toHaveBeenCalledWith('Feature test-feature-name declared JS client event hook, but is missing clientName to hook');
    mockConsoleInfo.mockRestore();
  });

  it('should log a console info messsage and return early if hook does not have eventName', () => {
    const hook = { clientName: FlexJsClient.conversationsClient };
    const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(jest.fn());
    JsClientEvents.addHook(Flex, manager, 'test-feature-name', hook);
    expect(mockConsoleInfo).toHaveBeenCalledWith('Feature test-feature-name declared JS client event hook, but is missing eventName to hook');
    mockConsoleInfo.mockRestore();
  });

  it('should register conversationJoined event hook for conversationsClient', async () => {
    const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(jest.fn());
    JsClientEvents.addHook(Flex, manager, 'feature', {clientName: FlexJsClient.conversationsClient, eventName: ConversationEvent.conversationJoined, jsClientHook: jest.fn() });
    expect(manager.conversationsClient.on).toHaveBeenCalledWith(ConversationEvent.conversationJoined, expect.any(Function));
    expect(mockConsoleInfo).toHaveBeenCalledWith("Feature feature registered %cconversationsClient conversationJoined %cevent hook: %cmockConstructor","font-weight:bold", "font-weight:normal", "font-weight:bold");
    mockConsoleInfo.mockRestore();
  });

  it('should register incoming event hook for voiceClient', () => {
    const hook = { clientName: FlexJsClient.voiceClient, eventName: VoiceEvent.incoming, jsClientHook: jest.fn() };
    JsClientEvents.addHook(Flex, manager, 'feature', hook);
    expect(manager.voiceClient.on).toHaveBeenCalledWith(VoiceEvent.incoming, expect.any(Function));
  });

  it('should register reservationCreated event hook for workerClient', () => {
    const hook = { clientName: FlexJsClient.workerClient, eventName: WorkerEvent.reservationCreated, jsClientHook: jest.fn() };
    JsClientEvents.addHook(Flex, manager, 'feature', hook);
    expect(manager.workerClient?.on).toHaveBeenCalledWith(WorkerEvent.reservationCreated, expect.any(Function));
  });

});
 