import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import CoachingStatusPanelComponent, { Props } from './CoachingStatusPanelComponent';

// Mapping the the logged in user sid so we can snag the Sync Doc
const mapStateToProps = (state: AppState) => {
    const myWorkerSID = state?.flex?.worker?.worker?.sid;
  
    // Also pulling back the states from the redux store as we will use those later
    // to manipulate the buttons
    const reduxStore = state[reduxNamespace].supervisorBargeCoach;
    const supervisorArray = reduxStore.supervisorArray;
    
    return {
      myWorkerSID,
      supervisorArray,
    };
  };

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
    setBargeCoachStatus: bindActionCreators(Actions.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(Flex.withTaskContext<Props, typeof CoachingStatusPanelComponent>(Flex.withTheme(CoachingStatusPanelComponent)));
