import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import SupervisorPrivateModeButtonComponent, { Props } from './SupervisorPrivateModeButtonComponent';

// Mapping the agent's sid, supervisor full name, and coachingStatusPanel flag within the custom redux store/state
const mapStateToProps = (state: AppState) => {
    const agentWorkerSID = state?.flex?.supervisor?.stickyWorker?.worker?.sid;
    const supervisorFN = state?.flex?.worker?.attributes?.full_name;
  
    const reduxStore = state?.['custom'].supervisorBargeCoach;
    const coaching = reduxStore.coaching;
    const coachingStatusPanel = reduxStore.coachingStatusPanel
  
    // Storing the coachingStatusPanel value that will be used in SupervisorBargePlugin.js
    // If the supervisor refreshes, we want to remember their preference
    console.log('Storing privateToggle to cache');
    localStorage.setItem('privateToggle',`${coachingStatusPanel}`);
  
    return {
      agentWorkerSID,
      supervisorFN,
      coaching,
      coachingStatusPanel
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
    setBargeCoachStatus: bindActionCreators(Actions.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(Flex.withTaskContext<Props, typeof SupervisorPrivateModeButtonComponent>(Flex.withTheme(SupervisorPrivateModeButtonComponent)));