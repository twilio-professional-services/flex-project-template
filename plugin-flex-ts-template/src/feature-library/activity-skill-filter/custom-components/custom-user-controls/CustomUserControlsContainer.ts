import { connect, ConnectedProps } from 'react-redux';
import CustomUserControlsComponent from './CustomUserControlsComponent';
import { AppState } from '../../../../flex-hooks/states'

const mapStateToProps = (state: AppState) => {
  // Bring worker skills into props so that component updates
  // when assigned skills change
  const { flex: { worker: { attributes } } } = state;
  const { routing = { skills: [], levels: {} } } = attributes;
  const skills = routing.skills || [];

  return {
	workerSkills: skills
  };
};

const connector = connect(mapStateToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(CustomUserControlsComponent);