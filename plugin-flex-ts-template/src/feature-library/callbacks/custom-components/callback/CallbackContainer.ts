import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/callback';
import CallbackComponent from './CallbackComponent';


const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  startCall: bindActionCreators(Actions.callCustomer, dispatch)
});

const connector = connect(undefined, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(CallbackComponent);
