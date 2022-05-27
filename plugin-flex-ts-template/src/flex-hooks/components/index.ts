import * as Flex from '@twilio/flex-ui';
import AgentDesktopView from './AgentDesktopView';
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
import NoTaskCanvas from './NoTaskCanvas';
import OutboundDialerPanel from './OutboundDialerPanel';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  AgentDesktopView(flex, manager);
  CallCanvasActions(flex, manager);
  CRMContainer(flex, manager);
  MainHeader(flex, manager);
  NoTaskCanvas(flex, manager);
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
}
