import * as Flex from '@twilio/flex-ui';
import AgentDesktopView from './AgentDesktopView';
import CallCanvas from './CallCanvas';
import CallCanvasActions from './CallCanvasActions';
import CRMContainer from './CRMContainer';
import MainHeader from './MainHeader';
import ParticipantCanvas from './ParticipantCanvas';
import QueueStats from './QueueStats';
import SideNav from './SideNav';
import TaskCanvasHeader from './TaskCanvasHeader';
import TaskCanvasTabs from './TaskCanvasTabs'
import TaskListButtons from './TaskListButtons';
import TaskOverviewCanvas from './TaskOverviewCanvas';
import TeamsView from './TeamsView';;
import ViewCollection from './ViewCollection';
import WorkerCanvas from './WorkerCanvas';
import WorkersDataTable from './WorkersDataTable';
import WorkerDirectory from './WorkerDirectory';
import NoTasksCanvas from './NoTasksCanvas';
import OutboundDialerPanel from './OutboundDialerPanel';
import TaskInfoPanel from './TaskInfoPanel';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  AgentDesktopView(flex, manager);
  CallCanvas(flex, manager);
  CallCanvasActions(flex, manager);
  CRMContainer(flex, manager);
  MainHeader(flex, manager);
  NoTasksCanvas(flex, manager);
  ParticipantCanvas(flex, manager);
  QueueStats(flex, manager);
  SideNav(flex, manager);
  TaskCanvasHeader(flex, manager);
  TaskCanvasTabs(flex, manager);
  TaskListButtons(flex, manager);
  TaskOverviewCanvas(flex, manager);
  TeamsView(flex, manager);
  ViewCollection(flex, manager);
  WorkerCanvas(flex, manager);
  WorkersDataTable(flex, manager);
  WorkerDirectory(flex, manager);
  OutboundDialerPanel(flex, manager);
  TaskInfoPanel(flex, manager);
}
