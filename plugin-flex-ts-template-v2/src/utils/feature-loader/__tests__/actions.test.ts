import {addHook} from '../actions';
import * as Flex from '@twilio/flex-ui';
import {expect, jest, describe, it} from '@jest/globals';

describe('addHook', () => {
  const mockFlex = {} as typeof Flex;
  const mockManager = Flex.Manager.getInstance();

  it('should call the provided actionHook with the correct arguments', () => {
    const mockActionHook = jest.fn();
    const hook = { actionEvent: 'someEvent', actionName: 'someAction', actionHook: mockActionHook };
    addHook(mockFlex, mockManager, 'feature', hook);
    expect(mockActionHook).toHaveBeenCalledWith(mockFlex, mockManager);
  });

  it('should log a message when registering an action hook', () => {
    const hook = { actionEvent: 'someEvent', actionName: 'someAction', actionHook: jest.fn() };
    const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(jest.fn());
    addHook(mockFlex, mockManager, 'feature', hook);
    expect(mockConsoleInfo).toHaveBeenCalledWith("Feature feature registered %csomeEventsomeAction %caction hook: %cmockConstructor", "font-weight:bold", "font-weight:normal", "font-weight:bold");
    mockConsoleInfo.mockRestore();
  });

  it('should handle hooks without actionEvent or actionName', () => {
    const hookWithoutEvent = { actionName: 'someAction', actionHook: jest.fn() };
    const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(jest.fn());
    addHook(mockFlex, mockManager, 'feature', hookWithoutEvent);
    expect(mockConsoleInfo).toHaveBeenCalledWith("Feature feature registered %cundefinedsomeAction %caction hook: %cmockConstructor", "font-weight:bold", "font-weight:normal", "font-weight:bold");

    const hookWithoutName = { actionEvent: 'someEvent', actionHook: jest.fn() };
    addHook(mockFlex, mockManager, 'feature', hookWithoutName);
    expect(mockConsoleInfo).toHaveBeenCalledWith('Feature feature registered %csomeEventundefined %caction hook: %cmockConstructor', "font-weight:bold", "font-weight:normal", "font-weight:bold");
    mockConsoleInfo.mockRestore();
  });
});