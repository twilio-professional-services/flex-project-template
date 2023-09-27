import TaskSummaryTile from '../TaskSummaryTile/TaskSummaryTile';
import AgentTeamActivityTile from '../AgentTeamActivityTile/AgentTeamActivityTile';
import ChannelCapacityTile from '../ChannelCapacityTile/ChannelCapacityTile';
import { TeamsViewTilesContainer } from './TeamsViewDataTiles.Components';
import {
  isTaskSummaryEnabled,
  isChannelChat_CapacityEnabled,
  isChannelSMS_CapacityEnabled,
  isTeamActivityEnabled,
} from '../../config';

const TeamsViewDataTiles = () => {
  return (
    <TeamsViewTilesContainer>
      {isTaskSummaryEnabled() && <TaskSummaryTile />}
      {isChannelChat_CapacityEnabled() && <ChannelCapacityTile key="chat" channelName="Chat" />}
      {isChannelSMS_CapacityEnabled() && <ChannelCapacityTile key="sms" channelName="SMS" />}
      {isTeamActivityEnabled() && <AgentTeamActivityTile />}
    </TeamsViewTilesContainer>
  );
};

export default TeamsViewDataTiles;
