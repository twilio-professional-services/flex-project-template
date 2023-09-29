import TaskSummaryTile from '../TaskSummaryTile/TaskSummaryTile';
import AgentTeamActivityTile from '../AgentTeamActivityTile/AgentTeamActivityTile';
import { TeamsViewTilesContainer } from './TeamsViewDataTiles.Components';
import { isTaskSummaryEnabled, isTeamActivityEnabled } from '../../config';

const TeamsViewDataTiles = () => {
  return (
    <TeamsViewTilesContainer>
      {isTaskSummaryEnabled() && <TaskSummaryTile />}
      {isTeamActivityEnabled() && <AgentTeamActivityTile />}
    </TeamsViewTilesContainer>
  );
};

export default TeamsViewDataTiles;
