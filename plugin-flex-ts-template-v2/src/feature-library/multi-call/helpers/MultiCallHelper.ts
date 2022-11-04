import { Actions, ConferenceParticipant, ITask, Manager, TaskHelper, VERSION as FlexVersion, } from '@twilio/flex-ui';
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
  console.log('MultiCall: FlexDeviceCall incoming');
  
  FlexDeviceCall = call;
  call.on("disconnect", handleFlexCallDisconnect);
  
  let newDevice = false;
  
  if (!SecondDevice || SecondDevice?.state === 'destroyed') {
    // Create a new device so that an additional incoming call can be handled
    createNewDevice(manager);
    newDevice = true;
  } else if (SecondDeviceCall) {
    // place other calls on hold
    holdOtherCalls(FlexDeviceCall?.parameters.CallSid ?? "");
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
  console.log('MultiCall: FlexDeviceCall disconnect', call);
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
  console.log('MultiCall: SecondDeviceCall incoming', call);
  
  call.on("accept", (_innerCall) => {
    console.log('MultiCall: SecondDeviceCall accept', call);
    SecondDeviceCall = call;
    
    // place other calls on hold
    holdOtherCalls(SecondDeviceCall?.parameters.CallSid ?? "");
    
    // put the current call in state
    Manager.getInstance().store.dispatch({type:"PHONE_ADD_CALL", payload:SecondDeviceCall});
  });
  
  call.on("disconnect", (_innerCall: Call) => {
    console.log('MultiCall: SecondDeviceCall disconnect', call);
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

const holdOtherCalls = (ignoreCallSid: string) => {
  Manager.getInstance().store.getState().flex.worker.tasks.forEach((task) => {
    const callSid = getMyCallSid(task);
    
    if (callSid === ignoreCallSid) return;
    
    if (callSid) {
      // mute the call: even though we're holding it, the worker is still being recorded
      muteCall(callSid, true);
    }
    
    // hold individual participants in case of a multi-party conference
    if (task && task.conference && task.conference.participants) {
      task.conference.participants.forEach((p: ConferenceParticipant) => {
        if (!p.isCurrentWorker && p.status === 'joined') {
          Actions.invokeAction("HoldParticipant", {
            participantType: p.participantType,
            task,
            targetSid: p.participantType === 'worker' ? p.workerSid : p.callSid
          });
        }
      });
    }
  });
}

const muteCall = (callSid: string, mute: boolean) => {
  if (FlexDeviceCall && FlexDeviceCall.parameters.CallSid === callSid) {
    FlexDeviceCall.mute(mute);
  } else if (SecondDeviceCall && SecondDeviceCall.parameters.CallSid === callSid) {
    SecondDeviceCall.mute(mute);
  }
}

export const getMyCallSid = (task: ITask): string | null => {
  let callSid = null;
  
  if (task && task.conference && task.conference.participants) {
    task.conference.participants.forEach((p: ConferenceParticipant) => {
      // Find our worker in the list of participants to get the call SID.
      if (p.isCurrentWorker && p.callSid) {
        callSid = p.callSid;
      }
    });
  }
  
  return callSid;
}

export const handleUnhold = (payload: any) => {
  let task;
  
  if (payload.task) {
    task = payload.task;
  } else if (payload.sid) {
    task = TaskHelper.getTaskByTaskSid(payload.sid);
  }
  
  const callSid = getMyCallSid(task);
  
  if (callSid) {
    // unmute the call, which we muted if we held it
    muteCall(callSid, false);
    
    // pass in the SID of the call we just unheld so that it doesn't get held again
    holdOtherCalls(callSid);
  }
}