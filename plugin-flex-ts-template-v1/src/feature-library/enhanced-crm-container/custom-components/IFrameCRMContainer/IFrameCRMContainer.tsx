import IFrameComponent from "./IFrameCRMComponent";
import { connect, ConnectedProps } from 'react-redux'
import { AppState } from '../../../../flex-hooks/states'


const mapStateToProps = (state: AppState) => {
  return {
    tasks: state.flex.worker.tasks
  };
};

const connector = connect(mapStateToProps);

export type ContainerProps = ConnectedProps<typeof connector>;
export default connect(mapStateToProps)(IFrameComponent);
