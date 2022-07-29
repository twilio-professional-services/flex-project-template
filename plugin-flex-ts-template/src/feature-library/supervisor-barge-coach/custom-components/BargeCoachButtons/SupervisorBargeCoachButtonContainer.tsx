import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import SupervisorBargeCoachButton, { Props } from './SupervisorBargeCoachButtonComponent';

const mapStateToProps = (state: AppState) => {
    // Getting the Supervisor's workerSID so we can use it later, the Agent's workerSID (stickyWorker) we are monitoring
    // This is specific to coaching to ensure we are unmuting the correct worker, if there are multiple agents on the call
    const myWorkerSID: string = state?.flex?.worker?.worker?.sid;
    const agentWorkerSID: string = state?.flex?.supervisor?.stickyWorker?.worker?.sid || "";
    const supervisorFN: string = state?.flex?.worker?.attributes?.full_name;

    console.log(`sticky worker = ${agentWorkerSID}`);
  
    // Also pulling back the states from the redux store as we will use those later
    // to manipulate the buttons

    const reduxStore = state[reduxNamespace].supervisorBargeCoach;
    const muted = reduxStore.muted;
    const barge = reduxStore.barge;
    const enableBargeinButton = reduxStore.enableBargeinButton;
    const coaching = reduxStore.coaching;
    const enableCoachButton = reduxStore.enableCoachButton;
    const coachingStatusPanel = reduxStore.coachingStatusPanel;
  
    const teamViewPath = state?.flex?.router?.location?.pathname;
  
    // Storing teamViewPath and agentSyncDoc to browser cache to help if a refresh happens
    // will use this in the main plugin file to invoke an action to reset the monitor panel
    // and clear the Agent's Sync Doc
    if (teamViewPath != null) {
      console.log('Storing teamViewPath to cache');
      localStorage.setItem('teamViewPath',teamViewPath);
  
      console.log('Storing agentSyncDoc to cache');
      localStorage.setItem('agentSyncDoc',`syncDoc.${agentWorkerSID}`);
    }
  
    return {
      myWorkerSID,
      agentWorkerSID,
      supervisorFN,
      muted,
      barge,
      enableBargeinButton,
      coaching,
      enableCoachButton,
      coachingStatusPanel
    };

};

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
    setBargeCoachStatus: bindActionCreators(Actions.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(Flex.withTaskContext<Props, typeof SupervisorBargeCoachButton>(Flex.withTheme(SupervisorBargeCoachButton)));