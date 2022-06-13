import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { bindActionCreators, Dispatch } from 'redux';
import { Actions as CustomQueueDirectoryActions } from '../../flex-hooks/states/CustomQueueTransferDirectory'
import CustomQueueTransferDirectory from './CustomQueueTransferDirectoryComponent';

const mapStateToProps = (state: AppState) => {
  const { queuesList } = state[reduxNamespace].customQueueTransferDirectory

  return {
    queuesList: Array.isArray(queuesList) ? queuesList : [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  updateAvailableQueues: bindActionCreators(CustomQueueDirectoryActions.updateAvailableQueues, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default Flex.withTaskContext(connector(CustomQueueTransferDirectory));
