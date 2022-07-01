import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import SupervisorMonitorPanelComponent, { Props } from './SupervisorMonitorPanelComponent';


// Mapping the agent's sid and supervisor full name
const mapStateToProps = (state: AppState) => {
    const agentWorkerSID = state?.flex?.supervisor?.stickyWorker?.worker?.sid;
    const supervisorFN = state?.flex?.worker?.attributes?.full_name;
  
    // Also pulling back the states from the redux store as we will use those later
    // to manipulate the buttons
    const reduxStore = state?.['custom'].supervisorBargeCoach;
    const supervisorArray = reduxStore.supervisorArray;
  
    return {
      agentWorkerSID,
      supervisorFN,
      supervisorArray
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
    setBargeCoachStatus: bindActionCreators(Actions.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(Flex.withTaskContext<Props, typeof SupervisorMonitorPanelComponent>(Flex.withTheme(SupervisorMonitorPanelComponent)));