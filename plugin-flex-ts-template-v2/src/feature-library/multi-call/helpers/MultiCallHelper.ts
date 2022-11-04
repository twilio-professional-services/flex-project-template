import { Actions, ConferenceParticipant, Manager, VERSION as FlexVersion, } from '@twilio/flex-ui';
import { Call, Device } from '@twilio/voice-sdk';

export let SecondDevice: Device | null = null;
export let SecondDeviceCall: Call | null = null;
export let FlexDeviceCall: Call | null = null;

const createNewDevice = (manager: Manager) => {
  
  const { acceptOptions, audioConstraints, ...customDeviceOptions } = manager.configuration.sdkOptions?.voice ?? {};
  
  const deviceOptions = {
    allowIncomingWhileBusy: false,
    ...customDeviceOptions,
    appName: "flex-ui",
    appVersion: FlexVersion
  };
  
  let device = new Device(manager.voiceClient.token ?? "", deviceOptions);
  
  SecondDevice = device;
}

export const handleFlexCallIncoming = (manager: Manager, call: Call) => {
  console.log('MultiCall: Incoming FlexDeviceCall');
  
  FlexDeviceCall = call;
  call.on("disconnect", handleFlexCallDisconnect);
  let newDevice = false;
  
  if (!SecondDevice || SecondDevice?.state === 'destroyed') {
    // Create a new device so that an additional incoming call can be handled
    createNewDevice(manager);
    newDevice = true;
  }
  
  if (!newDevice) {
    // Do nothing else, SecondDevice is already good to go
    return;
  }
  
  // register listeners for the new SecondDevice
  SecondDevice?.on('incoming', handleSecondCallIncoming);
  SecondDevice?.on('registered', () => console.log('MultiCall: SecondDevice registered'));
  
  // register the new device with Twilio
  SecondDevice?.register();
}

const handleFlexCallDisconnect = (call: Call) => {
  console.log('MultiCall: FlexDevice disconnect', call);
  FlexDeviceCall = null;
  
  if (!SecondDeviceCall) {
    // No more calls; destroy the SecondDevice as it is no longer needed.
    destroySecondDevice();
  } else {
    // SecondDeviceCall is still in flight, so put it into state
    // Otherwise Flex thinks there is no call and disables some functionality
    Manager.getInstance().store.dispatch({type:"PHONE_ADD_CALL", payload:SecondDeviceCall});
  }
}

const handleSecondCallIncoming = (call: Call) => {
  console.log('MultiCall: SecondDevice incoming', call);
  
  call.on("accept", (_innerCall) => {
    console.log('MultiCall: SecondDevice accept', call);
    SecondDeviceCall = call;
    
    // place other calls on hold
    holdOtherCalls(SecondDeviceCall?.parameters.CallSid ?? "");
  });
  
  call.on("disconnect", (_innerCall: Call) => {
    console.log('MultiCall: SecondDevice disconnect', call);
    SecondDeviceCall = null;
    
    if (!FlexDeviceCall) {
      // No more calls; destroy the SecondDevice as it is no longer needed.
      destroySecondDevice();
    }
  });
  
  // auto-accept the call (we get here when the worker _accepts_ the task)
  call.accept();
}

const destroySecondDevice = () => {
  if (SecondDevice?.state === 'destroyed') {
    // SecondDevice is not valid already
    return;
  }
  SecondDevice?.destroy();
  console.log('MultiCall: SecondDevice destroyed');
}

export const holdOtherCalls = (ignoreCallSid: string) => {
  // TODO: Test if we need to also mute/unmute the other call so that recording doesn't leak
  
  Manager.getInstance().store.getState().flex.worker.tasks.forEach((task) => {
    let skip = false;
    
    if (task && task.conference && task.conference.participants) {
      // Make sure we don't hold the call we just accepted.
      task.conference.participants.forEach((p: ConferenceParticipant) => {
        // Find our worker in the list of participants to get the call SID.
        if (p.isCurrentWorker && p.callSid === ignoreCallSid) {
          skip = true;
        }
      });
    }
    
    if (skip) return;
    
    Actions.invokeAction("HoldCall", {
      task
    });
  });
}