import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux'
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/callback';
import CallbackComponent from './CallbackComponent';

const mapStateToProps = (state: AppState) => ({
  isCompletingCallbackAction: state[reduxNamespace].callback.isCompletingCallbackAction, 
  isRequeueingCallbackAction: state[reduxNamespace].callback.isRequeueingCallbackAction
});

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  startCall: bindActionCreators(Actions.callCustomer, dispatch),
  requeueCallback: bindActionCreators(Actions.requeueCallback, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(CallbackComponent);
