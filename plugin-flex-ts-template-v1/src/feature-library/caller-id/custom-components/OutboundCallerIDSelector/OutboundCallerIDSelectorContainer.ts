import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../flex-hooks/states/OutboundCallerIDSelector';
import OutboundCallerIDSelectorComponent from './OutboundCallerIDSelectorComponent';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'

const mapStateToProps = (state: AppState) => {
  const { isFetchingPhoneNumbers, fetchingPhoneNumbersFailed, phoneNumbers, isUpdatingAttributes, updatingAttributesFailed, selectedCallerId } = state[reduxNamespace].outboundCallerIdSelector;

  return {
    isFetchingPhoneNumbers,
    fetchingPhoneNumbersFailed,
    isUpdatingAttributes,
    updatingAttributesFailed,
    phoneNumbers,
    selectedCallerId
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  getPhoneNumbers: bindActionCreators(Actions.getPhoneNumbers, dispatch),
  setCallerId: bindActionCreators(Actions.setCallerId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(OutboundCallerIDSelectorComponent);
