import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

// Standard Barge Coach Feature
import SupervisorBargeCoachButton from '../../custom-components/BargeCoachButtons'

// Advancted Barge Coach Features
import SupervisorPrivateToggle from '../../custom-components/SupervisorPrivateModeButton'
import SupervisorMonitorPanel from '../../custom-components/SupervisorMonitorPanel'
import CoachingStatusPanel from '../../custom-components/CoachingStatusPanel'

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.supervisor_barge_coach;


export function addSupervisorBargeCoachButtons(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  //FIXME: Remove, putting in place for testing
  console.warn('Supervisor Barge - Coach Standard Enabled!');
   
  // Add the Barge-in and Coach Option
  flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorBargeCoachButton key="bargecoach-buttons" />);
  
  //FIXME: Adding an advanced feature toggle, this will likely get moved, these are alpha/beta features
  const advanced_barge_coach_features: boolean = false;

  if(!advanced_barge_coach_features) {
    console.warn('Advanced Supervisor Barge Coach Features Disabled');
    return;
  } else {
    console.warn('Advanced Supervisor Barge Coach Features Eanbled');
   
    // Add the Supervisor Private Mode Toggle
    flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorPrivateToggle key="supervisorprviate-button" />);
    // Add the Supervisor Monitor Panel
    flex.Supervisor.TaskCanvasTabs.Content.add(<SupervisorMonitorPanel title= "Supervisors Engaged" icon="Supervisor" key="supervisoronitorpanel" />);
    
    // Adding Coaching Status Panel to notify the agent who is Coaching them
    flex.CallCanvas.Content.add(
      <CoachingStatusPanel key="coaching-status-panel"> </CoachingStatusPanel>, {
        sortOrder: -1
    });
  }
}
